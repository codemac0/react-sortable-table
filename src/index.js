import React from 'react';
import { Query } from 'cogent-js';
import './styles.css';

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

export default class MSortableTable extends React.Component {
     
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            filter: {
              sort:{field: false,order: false},
              search:{},
            },
            columns: props.columns,
            data: props.data,
            searchType: props.multipleSearch ? "MULTIPLE" : "SINGLE",
            baseUrl: props.baseUrl ? props.baseUrl : false,
            badge: props.searchBadges ? true : false,
        };

        this.handleSort = this.handleSort.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.processSubmit = this.processSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleBadges = this.handleBadges.bind(this);

        this.input = React.createRef();
    }
    
    componentDidMount() {
        
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                data : this.props.data
            })
        }
    }
    
    handleSort(row) {
        
        const { filter } = this.state;
        
        if(filter.sort.field == row.field) {
            if(filter.sort.order == "ASC") {
              filter.sort.order = "DESC";
            } else {
              filter.sort.order = "ASC";
            }
        } else {
          filter.sort.field = row.field;
          filter.sort.order = "ASC";
        }
        this.setState({filter});

        if(!this.state.baseUrl) {
          this.props.onChange(filter)
        } else {
          this.processSubmit();
        }
        
        //this.props.onUpdate(sort);
    }

    handleSearch(e, field) {
      const { filter, searchType } = this.state;
      if(searchType === "SINGLE") {
        filter.search = {};
      }
      
      if(e.target.value == "") {
        delete filter.search[field];
      } else {
        filter.search[field] = e.target.value;
      }

      this.setState({filter});
      
      if(!this.state.baseUrl) {
        this.props.onChange(filter)
      }
    }

    handleKeyPress(e) {
      if(event.key === 'Enter') {
        this.processSubmit();
      }
    }

    processSubmit() {
      const {filter, baseUrl} = this.state;
      
      const query = new Query();
      var retriveUrl = query.for(baseUrl);

      if(!isEmpty(filter.search)) {
        for(var key in filter.search) {
          retriveUrl = retriveUrl.where(key, filter.search[key]);
        }
      }

      if(filter.sort.field) {
        var sort_url = filter.sort.field; 
        if(filter.sort.order == "DESC") {
            sort_url = "-"+sort_url;
        }
        
        retriveUrl = retriveUrl.sort(sort_url);
      }

      this.props.onChange(filter,retriveUrl.get());

    }

    handleBadges(key) {
      const {filter} = this.state;

      if(key == "CLEAR") {
        filter.search = {};
      }

      if(filter.search[key]) {
        delete filter.search[key];
      }

      this.setState({filter});

      if(!this.state.baseUrl) {
        this.props.onChange(filter)
      } else {
        this.processSubmit();
      }
    }
    
    renderSortIcon(field) {
        const { filter } = this.state;
        var sortIc = <ArrowUp/>;
        if(filter.sort.field == field) {
            if(filter.sort.order == "ASC") {
                sortIc = <ArrowUp/>
            }
            if(filter.sort.order == "DESC") {
                sortIc = <ArrowDown/>
            }
        }
        
        return sortIc;
    }
    
    render() {
        return(
          <div className='react-sortable-table'>
            {this.state.badge && 
              <Badges data={this.state.filter.search} onRemove={this.handleBadges} />
            }
            <table className='table mac-table'>
                <thead>
                    <tr>
                        {this.state.columns.map((val,index) => 
                            <th className={val.sortable ? 'sortable' : ''} key={index}>
                                <span onClick={() => { if(val.sortable) { this.handleSort(val) } } }>
                                    {val.label}  
                                    {val.sortable && this.renderSortIcon(val.field)}
                                </span>
                                {val.searchable == true && 
                                  <div>
                                    {val.searchList ?
                                      <div className="flex-center">
                                          <select onChange={(e) => { this.handleSearch(e,val.field)}}>
                                              {val.searchList.map((val,index) => 
                                                  <option key={index} value={val.value}>{val.label}</option>
                                              )}
                                          </select>
                                          <button type="button" className="btn btn-secondary" onClick={this.processSubmit}><SearchIcon /></button>  
                                      </div>
                                    :
                                      <div>
                                        <input type={val.searchType ? val.searchType : "text"} name="search" ref={this.input} onKeyPress={this.handleKeyPress} onChange={(e) => { this.handleSearch(e,val.field)}} placeholder="type here..." className="form-control" /> 
                                      </div>
                                    }
                                  </div>
                                }
                            </th>
                        )}
                        {this.props.actionButtons && <th> </th> }
                    </tr>
                </thead>
                {this.state.data.length > 0 ?
                 <tbody>
                    {this.state.data.map((row,rowIndex) =>
                      <tr key={rowIndex}>
                        {this.state.columns.map((val,index) =>
                            <td key={index}>
                                {val.render ? val.render(row,rowIndex) : val.forceValue ? val.forceValue : row[val.field] }
                            </td>
                        )}
                      </tr>
                    )}
                </tbody>
                : <tbody><tr className='no-data'><td>No data</td></tr></tbody> }
            </table>
          </div>
        );
    }
    
}

const Badges = ({data,onRemove}) => {
  if(!isEmpty(data)) {
    const badges_list = Object.keys(data).map(key => 
      <div className="badge-item" key={key}>
        <span className="field">{key}</span>
        <span className="label">{data[key]}</span>
        <span className="close" onClick={() => onRemove(key)}><CloseIcon /></span>
      </div>
    )
    return (
      <div className={'rst-badges'}>
        <span className="badge-item default-item" onClick={() => {onRemove("CLEAR")}}><span className="label">Clear</span></span>
        {badges_list}
      </div>
    )
  } else {
    return "";
  }
}

const ArrowUp = () => {
  return (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>
  )
}
const ArrowDown = () => {
  return (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path></svg>
  )
}
const SearchIcon = () => {
  return (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
  )
}
const CloseIcon = () => {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  )
}