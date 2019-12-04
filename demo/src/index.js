import React, {Component} from 'react'
import {render} from 'react-dom'

import MSortableTable from '../../src'

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }; 

    this.data = [
      {id:1,name:"Mukesh suthar",email:"medjfr01@gamil.com",status:1,created_at:"2019-12-10"},
      {id:1,name:"Ketan suthar",email:"meketan@gamil.com",status:0,created_at:"2019-12-14"},
      {id:1,name:"Vinod suthar",email:"medjfr01@gamil.com",status:1,created_at:"2019-12-14"},
    ];

    this.columns = [
      {
        field:"id",
        label:"ID",
        sortable: true,
        render: (row) => (
          <span>{row.id}</span>
        )
      },{
        field:"name",
        label:"Full name",
        sortable: true,
        searchable: true,
      },{
        field:"email",
        label:"Email",
        sortable: true,
        searchable: true
      },{
        field:"status",
        label:"Status",
        searchable: true,
        searchList: [{label:"All",value:""},{label:"Active",value:1},{label:"Inactive",value:0}],
        render: (row) => {
          if(row.status == 1) {
            return <span>Active</span>
          } else {
            return <span>Inactive</span>
          }
        }
      },{
        field:"created_at",
        label:"Created at",
        sortable: true,
        searchable: true,
        searchType: "date"
      }
    ];
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(data,url) {
    console.log("Data : ",data);
    console.log("Url : ",url);
  }

  render() {
    return (
      <div>
        <h3>React Sortable Table</h3><br/>
        <MSortableTable
          columns={this.columns}
          data={this.data}
          onChange={this.handleChange}
          baseUrl={'frontend/records'}
          multipleSearch={true}
          badges={true}
        />
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))
