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
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
`;

export const Box = styled.div`
  display: flex;
  height: 200px;
  width: 300px;
  font-size: 200%;
  justify-content: center;
  flex-direction: column;
  :hover {
    cursor: pointer;
    background: #120;
  }
  margin: ${props => props.margin}px;
`;

export const Lesson = styled.div`
  width: ${props => props.width}px;
  margin: 0 auto;
`;

export const Boss = styled.div`
  padding-bottom: 10px;
  width: 100%;
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

export const Word = styled.div`
  height: 10px;
  width: 10px;
  margin: 2px;
`;

export const Good = styled(Word)`
  background-color: green;
`;

export const Bad = styled(Word)`
  background-color: red;
`;

export const None = styled(Word)`
  background-color: dimgrey;
`;
