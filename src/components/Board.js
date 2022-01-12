import { v4 as uuidv4 } from "uuid";

import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Fab,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import ScatterPlotRoundedIcon from "@mui/icons-material/ScatterPlotRounded";

import BoardView from "../BoardView";
import BucketView from "../BucketView";
import colors from "../assets/colors";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const useStyles = makeStyles((theme) => ({
  board: {
    width: "100vw",
    height: "100vh",
  },
  title: {
    position: "fixed",
    fontWeight: "bold",
    top: 20,
    left: 20,
    zIndex: 30000,
    display: "flex",
    alignItems: "center",
  },
  toolbar: {
    position: "fixed",
    fontWeight: "bold",
    top: 20,
    right: 20,
    zIndex: 30000,
  },
}));

const newHighlight = {
  title: "New Highlight",
  body: "Here goes the content of the highlight !",
  w: 160,
  h: 200,
  bucket: null,
};

let set = false;

const Board = ({ title = "Untitled" }) => {
  const classes = useStyles();

  const [highlights, setHighlights] = useState(null);
  const [edit, setEdit] = useState(false);
  const [currTitle, setCurrTitle] = useState(title);
  const [bucketView, setBucketView] = useState(false);

  const [zoom, setZoom] = useState(100);

  // useEffect(() => {
  //   document.getElementById("main").addEventListener("wheel", (e) => {
  //     setZoom((zoom) => zoom + e.deltaY * 0.1);
  //   });
  // }, []);

  const removeHighlight = (id) => {
    setHighlights(highlights.filter((el) => el.id !== id));
  };

  useEffect(() => {
    document.title = currTitle + " | Ideaman";

    if (set) {
      window.localStorage.setItem(
        "bucket",
        JSON.stringify({ title: currTitle, highlights })
      );

      console.log("saving " + currTitle);
    }
  }, [currTitle]);

  useEffect(() => {
    console.log({ highlights });

    if (highlights) {
      window.localStorage.setItem(
        "bucket",
        JSON.stringify({ title: currTitle, highlights })
      );

      set = true;

      console.log("saving " + currTitle);
    }
  }, [highlights]);

  useEffect(() => {
    let bucket = JSON.parse(window.localStorage.getItem("bucket"));

    console.log("data from storage");
    console.log(bucket);

    if (bucket) {
      setCurrTitle(bucket.title);
      setHighlights(bucket.highlights || []);
    } else setHighlights([]);
  }, []);

  return (
    <div className={classes.board}>
      <div className={classes.title}>
        {edit ? (
          <TextField
            id="boardname"
            type="text"
            value={currTitle}
            variant="standard"
            inputProps={{
              style: { fontSize: "2em", padding: 0 },
            }}
            onChange={(event) => {
              setCurrTitle(event.target.value);
            }}
          />
        ) : (
          <Typography variant="h4">{currTitle}</Typography>
        )}
        <IconButton
          onClick={() => {
            setEdit(!edit);
          }}
        >
          {!edit ? <EditRoundedIcon /> : <CheckRoundedIcon />}
        </IconButton>
      </div>

      <div className={classes.toolbar}>
        <Fab
          size="medium"
          onClick={() => {
            setBucketView(!bucketView);
          }}
          style={{ margin: "0px 5px" }}
        >
          {bucketView ? <ViewColumnRoundedIcon /> : <ScatterPlotRoundedIcon />}
        </Fab>
        <Fab
          color="primary"
          onClick={() => {
            setHighlights([
              ...highlights,
              {
                ...newHighlight,
                id: uuidv4(),
                x: window.innerWidth / 2 - 80,
                y: window.innerHeight / 2 - 100,
                ...colors[parseInt(Math.random() * colors.length)],
              },
            ]);
          }}
          size="medium"
        >
          <AddRoundedIcon />
        </Fab>
      </div>
      <div id="main" style={{ transform: `scale(${zoom / 100})` }}>
        {highlights ? (
          !bucketView ? (
            <BoardView
              highlights={highlights}
              onChange={(id, conf) => {
                setHighlights(
                  highlights.map((el) => {
                    if (el.id === id) return { ...el, ...conf };
                    return el;
                  })
                );
              }}
              deleteHighlight={removeHighlight}
            />
          ) : (
            <BucketView
              highlights={highlights}
              onChange={(id, conf) => {
                setHighlights(
                  highlights.map((el) => {
                    if (el.id === id) return { ...el, ...conf };
                    return el;
                  })
                );
              }}
              deleteHighlight={removeHighlight}
            />
          )
        ) : (
          <div>
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
