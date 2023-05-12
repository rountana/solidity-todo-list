// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract TaskContract {
    event AddTaskEvent(address receipient, uint taskId);
    event DeleteTaskEvent(uint taskId, bool isDeleted);

    struct Task {
        uint id;
        string taskText;
        bool isDeleted;
    }

    struct Book {
        string title;
        string author;
        uint book_id;
    }

    Book book;

    string hello = "hello";
    // tasks is a variable of type Task that is persistengly stored in the blockchain storage
    Task[] private tasks;
    Task[] private testStruct;
    mapping(uint256 => address) taskToOwner;

    //
    // Add task -> push to array using struct(data, data, data) format.
    // check what tasks.length turns out to be lenght/ or l -1
    //
    function AddTask(string memory inputText, bool isDeleted) external {
        //note using length automatically gives us the right index for the arrays
        uint textId = tasks.length;
        tasks.push(Task(textId, inputText, false));
        taskToOwner[textId] = msg.sender;
        emit AddTaskEvent(msg.sender, textId);
    }

    function GetDummyString() external pure returns (string memory) {
        string memory result = "a lot of books";
        return result;
    }

    function SetDummyStruct() public {
        book.author = "JAMES B";
        book.book_id = 1;
        book.title = "Learn Java";
    }

    function GetDummyStruct() external view returns (Book memory) {
        Book memory result = book;
        return result;
    }

    // loop through all the taskToOwner arrays and get the task IDs linked to the owner
    // then loop through the tasks struct array to retrieve the tasks matching the retrieved task IDs for the owner.
    function GetTasks() external view returns (Task[] memory) {
        // function GetTasks() view external returns(string memory) {
        // get the loop counter
        // uint loopCounter = texttoOwner.length;
        //initialize an array to be returned when its done.
        // will we have access to tasks.lenght here ??
        // uint[] memory taskIds = new taskToOwner[](taskToOwner.length);
        // taskid index
        Task[] memory tempresult = new Task[](2);

        tempresult[0] = Task({
            id: 0,
            taskText: "Sample text",
            isDeleted: false
        });
        tempresult[1] = Task({
            id: 1,
            taskText: "Second sample",
            isDeleted: false
        });

        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;

        for (uint i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
        // uint[] memory taskIds;
        // uint taskIdsIndex = 0;
        // Task[] memory result = new Task[](tasks.length);

        // // check if msg.sender has matching IDs, if so save them
        // for (uint i = 0; i < tasks.length; i++) {
        //     //   // if owner has taskids associated with address, save the task ids
        //     if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
        //         // fetch the taskIDs for use later
        //         taskIds[taskIdsIndex] = tasks[i].id;
        //         taskIdsIndex++;
        //     }

        //     // now retrieve the task from the task struct.
        //     uint counter = 0;
        //     for (i = 0; i < taskIdsIndex; i++) {
        //         if (tasks[i].id == taskIds[i]) {
        //             result[counter] = tasks[i];
        //             counter++;
        //         }
        //     }
        // }
        // return result;
    }

    // why not delete the array element ?
    function DeleteTask(uint taskId) external {
        if (taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isDeleted = true;
            emit DeleteTaskEvent(taskId, tasks[taskId].isDeleted);
        }
    }
}
