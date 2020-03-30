import styled from "styled-components";

export const StyledButtonWrapper = styled.div`
  padding: 5px 8px 5px 5px;
  position: fixed;
  bottom: 0;
  background-color: #c3c3c3;
  border-radius: 0px 20px 0px 0px;
  width: fit-content;
  border: 2px solid #aaa;
`;

export const StyledModalDiv = styled.div`
  margin: auto;
  text-align: center;
  font-size: 1.2rem;

  input,
  select {
    border: 1px solid grey;
    border-radius: 4px;
    font-size: 1.2rem;
    width: 300px;
  }

  .label {
    display: inline-block;
    width: 150px;
    space-wrap: nowrap;
    text-align: right;
    margin: 10px 10px;
  }

  .input {
    display: inline-block;
    border-radius: 2px;
  }

  input[type="text"]:focus {
    background-color: lightblue;
  }

  .form {
    margin: auto;
  }

  .modal-title {
    display: block;
    font-size: 1.8rem;
    font-weight: bold;
    margin: 10px;
  }
`;

export const StyledMainButton = styled.button`
  margin: 5px 5px 5px 5px;
  padding: 10px 10px 10px 10px;
  font-size: 1.2rem;
  background-color: #63b3c6;
  border-radius: 5px;
  border-style: none;
`;

export const StyledGroupTable = styled.table`
  margin: auto;
  border-collapse: collapse;

  th {
    background: white;
  }

  td {
    min-width: 200px;
    background: #ccc2e8;
    border: 1px solid grey;
    padding: 2px 0px 2px 5px;

    &:first-child {
      border-left: none;
    }

    &:last-child {
      min-width: 0;
      width: 150px;
      border-right: none;
      vertical-align: text-top;
    }

    &[colspan] {
      background: white;
      border-style: none;
      padding-bottom: 30px;

      td > & {
        padding-bottom: 0px;
      }
    }
  }

  td > & {
    width: 98%;
    float: right;
    margin: 20px auto 0px 30px;

    th {
      background: white;
    }
    td {
      background: #b1c9c1;
      border-right: none;
      &:last-child {
        min-width: 0;
        width: 150px;
      }
    }
  }
`;

export const StyledTemplateTable = styled.table`
  td > & {
    width: 98%;
    float: right;
    border-collapse: collapse;
    margin: 10px 0px 30px 30px;
    th {
      background: white;
    }

    td {
      border: 1px solid grey;
      border-right: none;
      background: #cea992;
      &:nth-child(5) {
        white-space: nowrap;
      }
      &:last-child {
        white-space: nowrap;
      }
    }
  }
`;

export const Td = styled.td`
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ErrorDiv = styled.div`
  color: red;
  margin-top: 10px;
  ${props => props.link && `color: blue; cursor: pointer;`};
  opacity: 0.8;
`;
