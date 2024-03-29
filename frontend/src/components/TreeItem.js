import { useEffect, useState } from "react";
import { URLS } from "../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

function TreeItem({object, listItemClickEvent, showCheckbox, isCrons}) {
  const {index, name, isDir, fullPath, expression, cronFileName, options, selected} = object;

  const [inputChecked, setInputChecked] = useState(false);

  const handleClickEvent = (e) => {
    listItemClickEvent(e.currentTarget.dataset.path);
  };

  const updateCheckedValue = (e) => {
    setInputChecked(e.currentTarget.checked);
    return listItemClickEvent(e);
  }

  useEffect(() => {
    if (showCheckbox) {
      setInputChecked(selected);
    }
  }, [selected, showCheckbox, setInputChecked]);
  console.log(object);
  if (isCrons) {
    if (showCheckbox) {
      return (
        <div>
          <input type="checkbox" name={options.name} data-index={index} onChange={updateCheckedValue} id={index} checked={!!inputChecked} /> &nbsp;
          <label htmlFor={index}>{options.name}</label>
        </div>);
    } else {
      return (
      <div className="columns">
        <div className="column">{options.name}</div>
        <div className="column">{cronFileName}</div>
        <div className="column">{expression}</div>
      </div>
      )
    }
  }

  if (showCheckbox) {
    return (
      <div>
        <input type="checkbox" name={name} data-index={index} onChange={updateCheckedValue} id={index} checked={!!inputChecked} /> &nbsp;
        <FontAwesomeIcon icon={isDir ? faFolder : faFile} /> &nbsp;
        <label htmlFor={index}>{name}</label>
      </div>);
  }

  if (!isDir && !isCrons) {
    return (
      <div>
        <a href={`${URLS['GET_FILE']}/?path=${fullPath}`}>{name}</a>
      </div>
    );
  } else {
    return (
      <div className="clickable-cursor" onClick={handleClickEvent} data-path={fullPath}>{name}</div>
    );
  }
}

export default TreeItem;