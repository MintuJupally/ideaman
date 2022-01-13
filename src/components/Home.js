import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Typography, Container, CircularProgress, Card } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const useStyles = makeStyles((theme) => ({
  board: {
    width: "160px",
    height: "160px",
    transition: "all 150ms ease-in-out !important",
    "&:hover": {
      transform: "scale(1.04)",
    },
    cursor: "pointer",
    margin: "10px 10px",
    padding: "20px",
    boxSizing: "border-box",
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const [boards, setBoards] = useState(null);

  useEffect(() => {
    let localBoards = JSON.parse(window.localStorage.getItem("boards"));

    if (localBoards) {
      localBoards = localBoards
        .map((id) => JSON.parse(window.localStorage.getItem(id)))
        .sort((a, b) => b.time - a.time);

      setBoards(localBoards);
    } else setBoards([]);
  }, []);

  const showTime = (el) => {
    let time = el.time;

    let dur = parseInt((Date.now() - time) / 1000);

    if (dur < 60) {
      return dur + " s ago";
    }
    dur = parseInt(dur / 60);

    if (dur < 60) return dur + " min ago";
    dur = parseInt(dur / 60);

    if (dur < 24) return dur + " h ago";
    dur = parseInt(dur / 24);

    if (dur < 31) return dur + " d ago";
    dur = parseInt(dur / 30.437);

    if (dur < 12) return dur + " m ago";
    dur = parseInt(dur / 12);

    return dur + " y ago";
  };

  return (
    <div>
      {boards ? (
        <Container>
          <div style={{ padding: "20px 0px" }}>
            <Typography variant="h4">IDEAMAN</Typography>
            <Typography>Your idea management buddy</Typography>
          </div>
          <div
            style={{
              height: "5px",
              borderBottom: "1px solid black",
              width: "min(400px,90vw)",
              margin: "0px auto 40px auto",
            }}
          ></div>
          <div>
            <Typography
              variant="h5"
              style={{ textAlign: "left", paddingBottom: "20px" }}
            >
              Your Boards
            </Typography>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <Card
                className={classes.board}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgb(108, 194, 247,0.3)",
                }}
                onClick={() => {
                  navigate("/board");
                }}
              >
                <div>
                  <AddRoundedIcon color="primary" style={{ fontSize: "2em" }} />
                  <Typography color="primary"> New Board</Typography>
                </div>
              </Card>
              {boards.map((board) => (
                <Card
                  key={"board-" + board.id}
                  className={classes.board}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                  onClick={() => {
                    navigate(`/board/${board.id}`);
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <Typography
                      style={{
                        fontSize: "1.3em",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whitespace: "nowrap",
                      }}
                    >
                      {board.title}
                    </Typography>
                  </div>
                  <Typography
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: "5px",
                      fontStyle: "italic",
                      color: "grey",
                      fontSize: "0.9em",
                    }}
                  >
                    {showTime(board)}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      ) : (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Home;
