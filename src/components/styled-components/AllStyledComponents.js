import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  tr:last-child {
    td {
      padding-bottom: 10px;
    }
  }
  tr {
    td:nth-last-child(n + 3) {
      padding-right: 3px;
    }
    td:nth-last-child(n + 2) {
      border-right: 1px solid lightgrey;
      padding-left: 10px;
    }
    td:first-child {
      padding-right: 5px;
    }
  }
`;

export const Grid = styled.div`
  min-height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
`;

export const Box = styled.div`
  display: flex;
  flex-basis: 150px;
  height: 100px;
  max-width: 250px;
  font-size: 200%;
  justify-content: center;
  flex-direction: column;
  :hover {
    cursor: pointer;
    background: #efd;
  }
  margin: 20px;
  padding-right: 30px;
  padding-left: 30px;
`;

export const Boss = styled.div`
  padding-bottom: 10px;
  width: 800px;
  margin: 0 auto;
`;

export const Line = styled.div`
  font-size: 100%;
`;

export const MenuListingTr = styled.tr`
    ${props => props.source === "file" && `color: darkblue;`}
    ${props => props.source === "api" && `color: black;`}
    font-size: 18px;
    ${props =>
      !props.dontHover
        ? `
    :hover {
        background: #CDC;
    }`
        : `
    border-bottom: 1px solid lightgrey;
    `}
    cursor: pointer;
    margin-bottom:4px;
    margin-top:4px;
    td {
        padding-bottom: 1px;
        padding-top: 3px;
    }

}
`;

export const DeleteSpan = styled.span`
  :hover {
    background: #a77;
  }
  padding-right: 10px;
  padding-left: 10px;
  float: right;
  padding-bottom: 5px;
`;

export const CenterFlexDiv = styled.div`
  display: flex;
  justify-content: center;
`;
