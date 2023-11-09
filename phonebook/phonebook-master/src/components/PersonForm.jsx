import { useState } from "react";
import Notification from "./Notification";
import personService from "../services/persons";
const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);
  const showNotification = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 1000);
  };
  const handeInputName = (event) => setNewName(event.target.value);
  const handeInputNumber = (event) => setNewNumber(event.target.value);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.some((elem) => elem.name === newName)) {
      if (confirm(`${newName} is already added to phonebook`)) {
        const person = persons.find((elem) => elem.name === newName);
        showNotification(`Updated ${person.name}`);
        personService
          .update(person.id, { ...person, number: newNumber })
          .then((response) => {
            setPersons(
              persons.map((elem) => (elem.id !== person.id ? elem : response))
            ).catch((error) => {
              showNotification(error.response.data.error);
            });
          });
      }
    } else {
      showNotification(`Created ${newName}`);
      personService
        .create({ name: newName, number: newNumber })
        .then((response) => {
          setPersons(persons.concat(response));
        })
        .catch((error) => {
          showNotification(error.response.data.error);
        });
    }
  };
  return (
    <>
      <h2>add new</h2>
      <form name={"addForm"} onSubmit={handleSubmit}>
        <Notification message={message} />
        <div>
          name:{" "}
          <input name={"name"} autoComplete="on" onChange={handeInputName} />
        </div>
        <div>
          number:{" "}
          <input
            name={"number"}
            autoComplete="on"
            onChange={handeInputNumber}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};
export default PersonForm;
