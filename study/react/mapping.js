class Contactinfo extends React.Component{
    render(){
      return(
        <div> {this.props.contact.name}
          {this.props.contact.phone}</div>
      );
    }
  }
  
  class Contact extends React.Component{
     constructor(props){
       super(props);
       this.state ={
         contactData:[
           {name:'Abet',phone:'010-0000-0001'},
           {name:'Berry',phone:'010-0000-0002'},
           {name:'Candy',phone:'010-0000-0003'},
           {name:'David',phone:'010-0000-0004'}
         ]
       }
     }
    render(){
      
      const mapToComponent=(data)=>{
        return data.map((contact,i)=>{
          return (<Contactinfo contact={contact} key={i}/>);
        })
      }
      return(
        <div>
          {mapToComponent(this.state.contactData)}
        </div>
      );
    }
  }
  
  class App extends React.Component {
    render() {
      return (
        <div>Codepen</div>
      );
    }
  };
  
  ReactDOM.render(
    <Contact/>,
    document.getElementById("root")
  );