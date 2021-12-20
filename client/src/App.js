import './App.css';
import { useState } from "react";
import Axios from 'axios';

function App() {
  const [search, setSearch] = useState("");

  const [buttonMsg, setButtonMsg] = useState("Add Contact");
  const [id, setId] = useState(0);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [contactList, setContactList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

  const getContacts = () => {
    Axios.post('http://localhost:3001/getall', {
      search: search
    })
      .then((res) => {
        setContactList(res.data);
        setFilteredList(res.data);
        clearFilter();
      });
  }

  const filterList = (_nameFilter, _emailFilter, _phoneFilter) => {
    var list = contactList.filter(f =>  
      (_nameFilter.trim() == "" || (f.firstname + f.lastname).includes(_nameFilter.trim())) &&
      (_emailFilter.trim() == "" || f.emailaddress.includes(_emailFilter.trim())) &&
      (_phoneFilter.trim() == "" || f.phonenumber.includes(_phoneFilter.trim()))      
    );
    setFilteredList(list);
  }

  const clearFilter = () => {
    setNameFilter("");
    setEmailFilter("");
    setPhoneFilter("");
  }

  const addContact = () => {
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress))) {
      alert("invalid email address");
      return;
    }
    Axios.post('http://localhost:3001/save', {
      id: id,
      profilePicture: profilePicture,
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      phoneNumber: phoneNumber
    }).then((res) => {
      refreshForm();
      getContacts();
      if(id > 0) {
        alert("contact updated");
      } else {
        alert("contact added");
      }
    });
  };

  const deleteContact = (_id) => {
    Axios.post('http://localhost:3001/delete', {
      id: _id
    }).then((res) => {
      getContacts();
      alert("contact deleted");
    });
  }

  const refreshForm = () => {
    setId(0);
    setFirstName("");
    setProfilePicture("");
    setLastName("");
    setEmailAddress("");
    setPhoneNumber("");
    setButtonMsg("Add Contact");
  }

  const editcontract = (_id) => {
    setId(_id);
    Axios.post('http://localhost:3001/getcontact', {
      id: _id
    }).then((res) => {
      setFirstName(res.data[0].firstname);
      setProfilePicture(res.data[0].profilepicture);
      setLastName(res.data[0].lastname);
      setEmailAddress(res.data[0].emailaddress);
      setPhoneNumber(res.data[0].phonenumber);
      setButtonMsg("Update Contact");
    });
  }

  return (
    <div className="App">
      <div className="form">
      {profilePicture}
        <img src={profilePicture} />
        <label>Profile Picture</label>
        <input type="file" onChange={(event) => {
          setProfilePicture(URL.createObjectURL(event.target.files[0]));
          console.log(URL.createObjectURL(event.target.files[0]));
        }} />
        <label>First Name</label>
        <input type="text" value={firstName} onChange={(event) => {
          setFirstName(event.target.value)
        }} />
        <label>Last Name</label>
        <input type="text" value={lastName} onChange={(event) => {
          setLastName(event.target.value)
        }} />
        <label>Email Address</label>
        <input type="email" value={emailAddress} onChange={(event) => {
          setEmailAddress(event.target.value)
        }} />
        <label>Phone Number</label>
        <input type="numbers" value={phoneNumber} onChange={(event) => {
          if (event.target.value ==="" || /^[0-9\b]+$/.test(event.target.value) ){
            setPhoneNumber(event.target.value)
          }
        }} pattern="[0-9]*"/>
        <button onClick={addContact}>{ buttonMsg }</button>
        <button onClick={refreshForm}>Clear Form</button>
      </div>
      <hr></hr>
      <div className="contacts">
        <div className="search">
        <input type="text" onChange={(event) => {
          setSearch(event.target.value)
        }} />
        <button onClick={getContacts}>Search</button>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><input type="text" value={nameFilter} onChange={(event) => {
                  setNameFilter(event.target.value); filterList(event.target.value, emailFilter, phoneFilter);
                }}></input></th>
                <th><input type="text" value={emailFilter} onChange={(event) => {
                  setEmailFilter(event.target.value); filterList(nameFilter, event.target.value, phoneFilter);
                }}></input></th>
                <th><input type="text" value={phoneFilter} onChange={(event) => {
                  setPhoneFilter(event.target.value); filterList(nameFilter, emailFilter, event.target.value);
                }} pattern="[0-9]*"></input></th>
                <th></th>
              </tr>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((m) => {
                return (
                  <tr key={m.id}>
                    <td><img src={m.profilepicture}></img></td>
                    <td>{m.firstname + m.lastname}</td>
                    <td>{m.emailaddress}</td>
                    <td>{m.phonenumber}</td>
                    <td><button onClick={() => { deleteContact(m.id) }}> delete</button><button onClick={() => {editcontract(m.id)}}> edit</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
