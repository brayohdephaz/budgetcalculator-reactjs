import React, { useState, useEffect } from "react";
import "./App.css";
import Alert from "./components/Alert";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { v4 as uuidv4 } from "uuid"; // sets the id value for the array

// localstorage.getItem('itemname);

// localstorage.setItem('item name');

// const initialExpenses = [
//   { id: uuidv4(), charge: "rent", amount: 1600 },
//   { id: uuidv4(), charge: "car payment", amount: 400 },
//   { id: uuidv4(), charge: "credit card bill", amount: 1200 },
// ];

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

// console.log(initialExpenses);

function App() {
  // **********state values ****************
  // All expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses); //Using functions
  //Single expense
  const [charge, setCharge] = useState("");

  //Single amount
  const [amount, setAmount] = useState("");

  //Alert
  const [alert, setAlert] = useState({ show: false });
  // Edit
  const [edit, setEdit] = useState(false);

  // Edit item
  const [id, setId] = useState(0);

  // **********UseEffect ****************
  useEffect(() => {
    console.log("we called useeffect");
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // **********functionallities ****************
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  // Handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //  Check if values are empty
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "Item edited successfully" });
      } else {
        // Create a new object
        const singleExpense = {
          id: uuidv4(),
          charge,
          amount,
        };
        setExpenses([...expenses, singleExpense]); //Use spread operator to be able to maintain the previous items then add new object.
        handleAlert({ type: "success", text: "items added successfully" });
      }
      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: `charge can't be empty and amount value must be bigger than zero`,
      });
    }
  };

  // Deleting all the items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All items deleted successfully" });
  };

  // Handle delete single items
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id); //tempExpenses returns the new array after the delet is done. It gets rid of the item.
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "Item deleted" });
    // console.log(tempExpenses);
  };

  // Handle Edit single items
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);

    let { charge, amount } = expense; //distructors our object
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
    //console.log(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>Budget calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending :{" "}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount)); //We have to parse our amount value from number to integer
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
