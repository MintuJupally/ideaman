import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Fab,
  IconButton,
  TextField,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import ScatterPlotRoundedIcon from "@mui/icons-material/ScatterPlotRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import BoardView from "../BoardView";
import BucketView from "../BucketView";
import colors from "../assets/colors";

const useStyles = makeStyles((theme) => ({
  board: {
    width: "100vw",
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

const Board = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();

  const [board, setBoard] = useState(null);
  const [edit, setEdit] = useState(false);
  const [bucketView, setBucketView] = useState(false);

  const [zoom, setZoom] = useState(100);

  // useEffect(() => {
  //   document.getElementById("main").addEventListener("wheel", (e) => {
  //     setZoom((zoom) => zoom + e.deltaY * 0.1);
  //   });
  // }, []);

  const removeHighlight = (id) => {
    console.log({ id });

    const curr = {
      ...board,
      highlights: board.highlights.filter((el) => el.id !== id),
    };

    console.log(curr);
    setBoard(curr);
  };

  useEffect(() => {
    if (board) {
      window.localStorage.setItem(
        board.id,
        JSON.stringify({ ...board, time: Date.now() })
      );

      console.log(board.highlights);
    }
  }, [board]);

  useEffect(() => {
    const pieces = location.pathname.split("/");

    let id = null;
    if (pieces.length === 3) id = pieces[2];

    let brd = null;
    if (id) brd = JSON.parse(window.localStorage.getItem(id));

    if (brd) {
      setBoard(brd);
    } else if (!id) {
      const newId = uuidv4();

      window.localStorage.setItem(
        newId,
        JSON.stringify({
          id: newId,
          title: "Untitled",
          highlights: [],
          time: Date.now(),
        })
      );

      let boards = JSON.parse(window.localStorage.getItem("boards"));
      if (!boards) boards = [];
      boards.push(newId);

      window.localStorage.setItem("boards", JSON.stringify(boards));

      navigate(`/board/${newId}`);
    } else {
      navigate("/boards");
    }
  }, [location]);

  if (board)
    return (
      <div className={classes.board}>
        <ClickAwayListener
          onClickAway={() => {
            if (edit) setEdit(false);
          }}
        >
          <div className={classes.title}>
            {edit ? (
              <TextField
                id="boardname"
                type="text"
                value={board.title}
                variant="standard"
                inputProps={{
                  style: { fontSize: "2em", padding: 0 },
                }}
                onChange={(event) => {
                  setBoard({ ...board, title: event.target.value });
                }}
              />
            ) : (
              <Typography variant="h4">{board.title}</Typography>
            )}
            <IconButton
              onClick={() => {
                setEdit(!edit);
              }}
            >
              {!edit ? <EditRoundedIcon /> : <CheckRoundedIcon />}
            </IconButton>
          </div>
        </ClickAwayListener>

        <div className={classes.toolbar}>
          <Fab
            size="medium"
            onClick={() => {
              navigate("/boards");
            }}
          >
            <HomeRoundedIcon color="primary" />
          </Fab>
          <Fab
            size="medium"
            onClick={() => {
              setBucketView(!bucketView);
            }}
            style={{ margin: "0px 5px" }}
          >
            {bucketView ? (
              <ViewColumnRoundedIcon color="primary" />
            ) : (
              <ScatterPlotRoundedIcon color="primary" />
            )}
          </Fab>
          <Fab
            color="primary"
            onClick={() => {
              setBoard({
                ...board,
                highlights: [
                  ...board.highlights,
                  {
                    ...newHighlight,
                    id: uuidv4(),
                    x: window.innerWidth / 2 - 80,
                    y: window.innerHeight / 2 - 100,
                    ...colors[parseInt(Math.random() * colors.length)],
                  },
                ],
              });
            }}
            size="medium"
          >
            <AddRoundedIcon />
          </Fab>
        </div>

        <div id="main" style={{ transform: `scale(${zoom / 100})` }}>
          {board ? (
            !bucketView ? (
              <BoardView
                highlights={board.highlights}
                buckets={board.buckets}
                updateBoard={(data) => {
                  setBoard({ ...board, ...data });
                }}
                updateHighlight={(id, conf) => {
                  setBoard({
                    ...board,
                    highlights: board.highlights.map((el) => {
                      if (el.id === id) return { ...el, ...conf };
                      return el;
                    }),
                  });
                }}
                deleteHighlight={removeHighlight}
              />
            ) : (
              <BucketView
                buckets={board.buckets}
                highlights={board.highlights}
                changeHighlightBucket={(id, conf) => {
                  console.log({ id, conf });

                  let curr = {
                    ...board,
                    highlights: board.highlights.map((el) => {
                      if (el.id === id) {
                        console.log({ ...el, ...conf });
                        return { ...el, ...conf };
                      }
                      return el;
                    }),
                  };

                  console.log(curr);
                  setBoard((board) => null);
                  console.log(board);
                  // setBoard((board) => ({
                  //   ...board,
                  //   highlights: board.highlights.map((el) => {
                  //     if (el.id === id) {
                  //       console.log({ ...el, ...conf });
                  //       return { ...el, ...conf };
                  //     }
                  //     return el;
                  //   }),
                  // }));
                }}
                updateBoard={(data) => {
                  setBoard({ ...board, ...data });
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

  return (
    <div
      className={classes.board}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Board;
