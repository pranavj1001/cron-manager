import "bulma/css/bulma.min.css";
import { useEffect, useState } from "react";
import './common.css';
import Footer from "./Footer";
import Modal from "./Modal";
import Tree from "./Tree";
import { MODAL_TYPES } from '../constants';
import { getCrons } from '../api';

function App() {

  const [crons, setCrons] = useState([]);

  const loadCrons = (ignore = false) => {
    getCrons()
      .then((result) => {
        if (result?.status === 200) {
          let index = 0;
          for (const cron of result.data["resp"]) {
            cron.index = index;
            index++;
          }
          if (!ignore) {
            setCrons(result.data["resp"]);
          }
        } else {
          console.log(`Not able to fetch the Crons. More details ${result}`);
          if (!ignore)
            setCrons([]);
        }
      })
      .catch((err) => {
        console.error(`Some Error Occurred while fetching the tree ${err}`);
        if (!ignore)
          setCrons([]);
      });
  }

  useEffect(() => {
    let ignore = false;
    if (!ignore)
      loadCrons(ignore);
    return () => ignore = true;
  }, []);

  const cronClickEvent = () => {
    console.log('Cron Clicked');
  };

  return (
    <div className="container hero is-fullheight max-width">
      <div className="margin-left-20px margin-right-20px margin-top-20px">
        <hr className="solid" />
          <div>
            <Modal data={MODAL_TYPES.CREATE_CRON} updateTree={loadCrons} />
            <Modal data={MODAL_TYPES.DELETE_CRONS} updateTree={loadCrons} items={crons} />
          </div>
          <hr className="solid" />
          <h2 className="margin-bottom-20px heading-2"><b>Active Crons</b></h2>
          <div className="columns">
            <div className="column"><b>Cron Name</b></div>
            <div className="column"><b>Cron File</b></div>
            <div className="column"><b>Cron Expression</b></div>
          </div>
          {(crons && crons.length > 0) ? <Tree treeList={crons} treeClickEvent={cronClickEvent} checkBoxTree={false} cronsTree={true} /> : "No Crons Active"}
      </div>
      <Footer />
    </div>
  );
}

export default App;
