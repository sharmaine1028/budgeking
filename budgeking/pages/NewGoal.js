import React from "react";
import { BlackButton } from "../config/reusableButton";
import { NewGoalInput, Title } from "../config/reusableText";

function NewGoal(props) {
  return (
    <>
      <Title text={"New Goal"} />
      <NewGoalInput title={"Goal Description"} />
      <NewGoalInput title={"Target Amount to Save"} />
      <NewGoalInput title={"Frequency"} />
      <NewGoalInput title={"Deadline"} />
      <NewGoalInput title={"Notes"} />
    </>
  );
}

export default NewGoal;
