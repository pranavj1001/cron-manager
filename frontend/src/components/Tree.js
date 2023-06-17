import TreeItem from "./TreeItem";

function Tree({treeList, treeClickEvent, checkBoxTree}) {

  const handleClickEvent = (e) => {
    treeClickEvent(e);
  };

  const renderedTree = treeList.map((object) => {
    return <TreeItem object={object} key={object.index} listItemClickEvent={handleClickEvent} showCheckbox={checkBoxTree} isCrons={true} />
  });

  return <div>{renderedTree}</div>;
}

export default Tree;