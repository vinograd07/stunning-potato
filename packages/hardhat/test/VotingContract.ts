import { expect } from "chai";

import { ethers } from "hardhat";

describe("VotingContract", function () {
  let voting: any;
  let owner: any;

  beforeEach(async function () {
    const ContractFactory = await ethers.getContractFactory("VotingContract");
    [owner] = await ethers.getSigners();
    voting = await ContractFactory.deploy();
  });

  describe("createPoll", function () {
    it("should allow the owner to create a poll", async function () {
      await voting.createPoll("What is your favorite color?", ["Red", "Blue", "Green"]);
      const allPolls = await voting.getAllPolls();

      expect(allPolls.questions[0]).to.equal("What is your favorite color?");
      expect(allPolls.optionsList[0]).to.deep.equal(["Red", "Blue", "Green"]);
    });

    it("should fail if question is empty", async function () {
      await expect(voting.createPoll("", ["Option 1", "Option 2"])).to.be.revertedWith("Question cannot be empty");
    });

    it("should fail if less than two options are provided", async function () {
      await expect(voting.createPoll("Question?", ["Only one option"])).to.be.revertedWith(
        "There must be at least two possible answers",
      );
    });
  });

  describe("vote", function () {
    beforeEach(async function () {
      await voting.createPoll("What is your favorite color?", ["Red", "Blue", "Green"]);
    });

    it("should allow a user to vote for an option", async function () {
      await voting.connect(owner).vote(0, 1); // addr1 votes for "Blue"
      const allPolls = await voting.getAllPolls();

      expect(allPolls.votesList[0][1]).to.equal(1); // Votes for "Blue"
    });

    it("should fail if the user votes more than once", async function () {
      await voting.connect(owner).vote(0, 1);
      await expect(voting.connect(owner).vote(0, 2)).to.be.revertedWith("You have already voted");
    });

    it("should fail if the option index is invalid", async function () {
      await expect(voting.connect(owner).vote(0, 3)).to.be.revertedWith("Invalid option index");
    });

    it("should fail if the poll ID is invalid", async function () {
      await expect(voting.connect(owner).vote(1, 0)).to.be.revertedWith("Voting with such an ID does not exist");
    });
  });

  describe("getAllPolls", function () {
    it("should return all polls with correct data", async function () {
      await voting.createPoll("What is your favorite color?", ["Red", "Blue", "Green"]);
      await voting.createPoll("What is your favorite animal?", ["Cat", "Dog", "Bird"]);

      const allPolls = await voting.getAllPolls();

      expect(allPolls.questions).to.deep.equal(["What is your favorite color?", "What is your favorite animal?"]);
      expect(allPolls.optionsList[0]).to.deep.equal(["Red", "Blue", "Green"]);
      expect(allPolls.optionsList[1]).to.deep.equal(["Cat", "Dog", "Bird"]);
    });
  });
});
