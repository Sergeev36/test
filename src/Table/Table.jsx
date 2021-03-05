import React from 'react'
import style from './Table.module.css'

export class Table extends React.Component {
   constructor() {
    super();

    this.state = {
        users: [],
        newUser: {},

        editData:false,
        getUser:[]
    }


     this.onChangeInput = this.onChangeInput.bind(this)
     this.onUpdateInput = this.onUpdateInput.bind(this)

     this.addPerson = this.addPerson.bind(this)
     this.delPerson = this.delPerson.bind(this)
     this. getPerson = this. getPerson.bind(this)
     this. updatePerson = this. updatePerson.bind(this)
}
     onChangeInput (e) {
         this.state.newUser[e.target.name] = e.target.value;
     }

     onUpdateInput (e) {

         let getUser = this.state.getUser;
         getUser.data[e.target.name] = e.target.value;
         this.setState({getUser});

     }



      addPerson () {

          let user = {
              "name": this.state.newUser.name,
              "age": this.state.newUser.age,
              "email": this.state.newUser.email
          }
          let userJson = {"data": user}

          fetch("http://178.128.196.163:3000/api/records", {
              method: 'PUT',
              body: JSON.stringify(userJson),
              headers: {'Content-Type': 'application/json'},
          })
              .then((response) => response.json())
              .then((response) => {

                  this.setState({ users: this.state.users.concat([response]) });

              })
           this.refInput ()
      }



    delPerson (id) {

        fetch("http://178.128.196.163:3000/api/records/"+id, {
            method: 'DELETE',
        })
            .then((response) => {
                this.setState({
                    users: this.state.users.filter(el => el._id != id)
                })
            })

    }


    getPerson (id) {
        this.state.editData = true;

        fetch("http://178.128.196.163:3000/api/records/"+id, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({ getUser: response })
            })

    }

    updatePerson (id) {

        fetch("http://178.128.196.163:3000/api/records/"+id, {
            method: 'POST',
            body: JSON.stringify({data:this.state.getUser.data}),
            headers: {'Content-Type': 'application/json'},
        })
            .then((response) => response.json())
            .then((response) => {

                this.setState({
                    users: this.state.users.map( user =>  user._id == id ? this.state.getUser : user)
                });


            })

        this.state.editData = false

    }



    componentDidMount() {

            fetch("http://178.128.196.163:3000/api/records")
                .then((response) => response.json())
                .then(response => this.setState({ users: response }))
                .catch(error => console.log(error));



    }



    render() {

        return (<div>
            <table className={style.table}>
                <thead>
                <tr >
                    <th>Name</th>
                    <th>Age</th>
                    <th>Email</th>
                </tr>
                </thead>


                {this.state.users.map( user =>

                < tbody  className={style.body} key={user._id} >

                    {this.state.editData && this.state.getUser._id  == user._id ?

                        <tr >
                            <td><input type="text" placeholder='Name...' name='name' onChange={this.onUpdateInput} value={this.state.getUser.data.name}/></td>
                            <td><input type="text" placeholder='Age...'  name='age' onChange={this.onUpdateInput} value={this.state.getUser.data.age}/></td>
                            <td><input type="text" placeholder='Email...' name='email' onChange={this.onUpdateInput} value={this.state.getUser.data.email}/></td>
                            <td><button onClick={() => {this.updatePerson(this.state.getUser._id)}}>Save</button></td>
                        </tr>
                        :
                        <tr className={style.tableElements}>
                            <td>{user.data.name}</td>
                            <td>{user.data.age}</td>
                            <td>{user.data.email}</td>
                            <td><button onClick={() => {this.getPerson(user._id)}}>Edit</button></td>
                            <td><button onClick={()=>{this.delPerson(user._id)}}>Delete</button></td>
                        </tr> }

                </tbody>

                )}


            </table>

            <div className={style.input}>
                <h2>Add new person</h2>
                <input type="text" placeholder='Name' onChange={this.onChangeInput} name='name' ref="name"/>
                <input type="text" placeholder='Age' onChange={this.onChangeInput} name='age' ref="age"/>
                <input type="text" placeholder='Email' onChange={this.onChangeInput} name='email' ref="email"/>
                <button onClick={this.addPerson} className={style.buttonAdd} >Add</button>
            </div>

            </div>
        )
    }


refInput () {
    this.refs.name.value = '';
    this.refs.age.value = '';
    this.refs.email.value = '';
}

}
