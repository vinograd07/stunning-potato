// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Poll {
        string question;
        string[] options;
        mapping(uint => uint) voteCounts;
        mapping(address => bool) hasVoted;
    }

    address public owner;

    Poll[] private polls;

    event PollCreated(uint pollId, string question);
    event Voted(uint pollId, uint optionIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createPoll(string memory _question, string[] memory _options) public onlyOwner {
        require(bytes(_question).length > 0, "Question cannot be empty");
        require(_options.length > 1, "There must be at least two possible answers");

        for (uint i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Option cannot be an empty string");
        }

        Poll storage newPoll = polls.push();
        newPoll.question = _question;
        newPoll.options = _options;

        emit PollCreated(polls.length - 1, _question);
    }

    function vote(uint _pollId, uint _optionIndex) public {
        require(_pollId < polls.length, "Voting with such an ID does not exist");
        Poll storage poll = polls[_pollId];

        require(!poll.hasVoted[msg.sender], "You have already voted");
        require(_optionIndex < poll.options.length, "Invalid option index");

        // Устанавливаем, что пользователь проголосовал
        poll.hasVoted[msg.sender] = true;
        // Увеличиваем счетчик голосов для выбранного варианта
        poll.voteCounts[_optionIndex]++;

        emit Voted(_pollId, _optionIndex);
    }

    function getAllPolls() public view returns (string[] memory questions, string[][] memory optionsList, uint[][] memory votesList) {
        uint totalPolls = polls.length;

        questions = new string[](totalPolls);
        optionsList = new string[][](totalPolls);
        votesList = new uint[][](totalPolls);

        for (uint i = 0; i < totalPolls; i++) {
            Poll storage poll = polls[i];

            questions[i] = poll.question;
            optionsList[i] = poll.options;

            uint[] memory votes = new uint[](poll.options.length);
            for (uint j = 0; j < poll.options.length; j++) {
                votes[j] = poll.voteCounts[j];
            }
            votesList[i] = votes;
        }
    }
}
