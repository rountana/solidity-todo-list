import WrongNetworkMessage from "../components/WrongNetworkMessage";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TodoList from "../components/TodoList";
// import TaskContract from "../../backend/build/contracts/TaskContract.json"
import TaskAbi from "../../backend/build/contracts/TaskContract.json";
import { TaskContractAddress } from "../config";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [tasks, setTasks] = useState("");
  const [allTasks, setAllTasks] = useState("");
  const [input, setInput] = useState("");

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  // const helloWorld = async () => {
  //   console.log("TaskAbi object" + JSON.stringify(TaskAbi.abi))
  //   console.log("Task Contract Address" + TaskContractAddress)
  //   connectWallet();
  // }

  useEffect(() => {
    connectWallet();
    getAllTasks();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not found");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("connected to chain:" + chainId);

      const sepoliaChainId = "0xaa36a7";

      if (sepoliaChainId != chainId) {
        console.log("You're not connected to Sepolia testnet");
        setCorrectNetwork(false);
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Logged in account address: " + accounts[0]);
      setUserLoggedIn(true);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error in connecting to wallet: " + error);
    }
  };

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try {
      // get access to the contract
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress, //taskContractAddress
          TaskAbi.abi, //taskabi
          signer //signer
        );

        // console.log("Reading Tasks.. Contract" + JSON.stringify(TaskContract))
        // console.log("Reading Tasks.. Signer" + JSON.stringify(signer))
        // console.log("Reading Tasks.. Provider" + JSON.stringify(provider))

        // let allTasks = await TaskContract.GetTasks()
        let dummyString = await TaskContract.GetDummyString();
        console.log("Tasks read from dummy string " + dummyString);
        let setStruct = await TaskContract.SetDummyStruct();
        let getStruct = await TaskContract.GetDummyStruct();
        console.log("Tasks read from getStruct " + getStruct);

        let returnedTasks = await TaskContract.GetTasks();
        setAllTasks(returnedTasks);
        console.log(
          "Tasks read from getTasks " + JSON.stringify(returnedTasks)
        );
      } else {
        console.log("Metamask not detected");
      }
    } catch (err) {
      console.log("Reading Tasks.. ERR");
      console.log("error from " + err);
    }
  };

  // Add tasks from front-end onto the blockchain
  const addTask = async (e) => {
    e.preventDefault(); // avoid refresh

    // set up a task object to send to the blockchain
    let task = {
      text: input,
      isDeleted: false,
    };

    // connect to the contract
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const TaskContract = new ethers.Contract(
        TaskContractAddress, //taskContractAddress
        TaskAbi.abi, //taskabi
        signer //signer
      );
      TaskContract.AddTask(task.text, task.isDeleted)
        .then((res) => {
          setTasks([...tasks, task]);
          console.log("Successfully added task");
        })
        .catch((err) => console.log("Unable to add task" + err));
    } else {
      console.log("Metamask not detected");
    }
  };

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = (key) => async () => {};

  return (
    <div className="bg-[#97b5fe] h-screen w-screen flex justify-center py-6">
      <button
        className="h-[5rem] m-5 text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
        onClick={getAllTasks}
      >
        {" "}
        Read Tasks{" "}
      </button>
      {!userLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : correctNetwork ? (
        <TodoList
          tasks={allTasks}
          input={input}
          setInput={setInput}
          addTask={addTask}
        />
      ) : (
        <WrongNetworkMessage />
      )}
      {/* {!('user not logged in') ? <ConnectWalletButton connectWallet={helloWorld} /> :
        ('its the correct network') ? <TodoList tasks = {allTasks} input={input} setInput={setInput} addTask={helloWorld} /> : <WrongNetworkMessage />} */}
    </div>
  );
}
