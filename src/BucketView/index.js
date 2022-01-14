import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Draggable from "react-draggable";

import { makeStyles } from "@mui/styles";
import { CheckRounded, CloseRounded } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  highlight: {
    height: "100px",
    width: "200px",
    padding: "20px",
    boxSizing: "border-box",
    margin: "2px",
    // position: "absolute",
  },
}));

const HighlightCard = ({ highlight, alter, focus, buckets }) => {
  const classes = useStyles();

  const [pos, setPos] = useState({ x: 0, y: 0 });

  const findBucket = (position) => {
    for (let i = 0; i < Object.entries(buckets).length; i++) {
      const buckCont = document.getElementById(`bucket-container-${i}`);
      const rect = buckCont.getBoundingClientRect();

      if (
        position.x > rect.x &&
        position.x < rect.x + rect.width &&
        position.y > rect.y &&
        position.y < rect.y + rect.height
      ) {
        return buckets[i];
      }
    }

    return null;
  };

  return (
    <Draggable
      handle={`.handle${highlight.id}`}
      // defaultPosition={{ x: 0, y: 0 }}
      position={pos}
      scale={1}
      onStart={(e, data) => {
        // setPos({ x: e.clientX, y: e.clientY });
        // console.log(e, data);
      }}
      // onDrag={(e, data) => {
      //   console.log(e, data);
      // }}
      onStop={(e, data) => {
        let el = null;
        if (
          e.target.ariaLabel &&
          e.target.ariaLabel.startsWith("highlight-card-")
        ) {
          el = e.target;
        } else if (
          e.target.parentElement.ariaLabel &&
          e.target.parentElement.ariaLabel.startsWith("highlight-card-")
        ) {
          el = e.target.parentElement;
        }
        if (
          e.target.parentElement.parentElement.ariaLabel &&
          e.target.parentElement.parentElement.ariaLabel.startsWith(
            "highlight-card-"
          )
        ) {
          el = e.target.parentElement.parentElement;
        }

        if (el) {
          let rect = el.getBoundingClientRect();

          const center = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const bucket = findBucket(center);

          if (
            !bucket ||
            !highlight.bucket ||
            bucket.id !== highlight.bucket.id
          ) {
            alter({ bucket });
            setPos({ x: data.lastX, y: data.lastY });
          }
        }
      }}
    >
      <Card
        style={{
          backgroundColor: highlight.bgColor,
          color: highlight.color,
          height: "100px",
          width: "200px",
          padding: "20px",
          boxSizing: "border-box",
          margin: "2px",
          cursor: "default",
          boxShadow: focus
            ? "0px 0x 5px 5px blue !important"
            : "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        }}
        className={`handle${highlight.id}`}
        aria-label={"highlight-card-" + highlight.id}
      >
        <div style={{ textAlign: "left" }}>
          {highlight.title !== "" && (
            <Typography
              style={{
                fontWeight: "bold",
                paddingBottom: "10px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {highlight.title}
            </Typography>
          )}
          {highlight.body !== "" && <div>{highlight.body}</div>}
        </div>
      </Card>
    </Draggable>
  );
};

const Bucket = ({
  bucket,
  highlights,
  index,
  buckets,
  onChange,
  updateBoard,
  deleteHighlight,
}) => {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("0");

  const handleClose = () => {
    setOpen(false);
  };

  const getBucketName = (id) => {
    let bkt = buckets.find((el) => el.id === id);

    if (bkt) return bkt.name;
    return "Deleted Bucket";
  };

  return (
    <div
      id={"bucket-container-" + index}
      style={{
        width: "200px",
        margin: "5px",
        marginTop: "5em",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "lightgrey",
        borderRadius: "5px",
        padding: "20px 25px 30px 25px",
        // position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            fontSize: "1.2em",
            border: "1px solid black",
            width: "100px",
            marginBottom: "20px",
            backgroundColor: "rgb(240,240,240)",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {getBucketName(bucket[0])}
        </Typography>
        <IconButton
          style={{ position: "absolute", right: 0, top: 0, color: "#e31d1d" }}
          size="small"
          onClick={() => {
            setOpen(true);
          }}
        >
          <CloseRounded />
        </IconButton>
      </div>

      {bucket[1].map((highlight) => (
        <HighlightCard
          highlight={highlight}
          key={highlight.id}
          buckets={buckets}
          alter={(config) => {
            onChange(highlight.id, config);
          }}
        />
      ))}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <div>
            <RadioGroup
              aria-label="gender"
              value={choice}
              name="radio-buttons-group"
              onChange={(e) => {
                setChoice(e.target.value);
              }}
            >
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="Delete bucket only, not the highlights"
              />
              <Typography style={{ color: "grey", paddingLeft: "30px" }}>
                Just the bucket is deleted, all the associated highlights are
                retained under Ungrouped
              </Typography>
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Delete bucket and its highlights"
              />
              <Typography style={{ color: "grey", paddingLeft: "30px" }}>
                The bucket along with all the highlights associated with the
                bucket are deleted
              </Typography>
            </RadioGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Fab
            onClick={() => {
              setChoice("0");
              setOpen(false);
            }}
            color="error"
            variant="extended"
            size="small"
            style={{
              color: "red",
              backgroundColor: "white",
            }}
          >
            <CloseRounded />
            &nbsp;&nbsp;CANCEL&nbsp;&nbsp;
          </Fab>
          <Fab
            onClick={() => {
              const bkts = buckets.filter((el) => el.id !== bucket[0]);

              let hlts = [...highlights];

              if (choice === "0") {
                console.log("updating ...");

                bucket[1].forEach((highlight) => {
                  const ind = hlts.findIndex((el) => el.id === highlight.id);
                  hlts[ind] = { ...hlts[ind], bucket: null };
                });
              } else {
                console.log("deleting ...");

                bucket[1].forEach((highlight) => {
                  const ind = hlts.findIndex((el) => el.id === highlight.id);
                  hlts.splice(ind, 1);
                });
              }
              updateBoard({ highlights: hlts, buckets: bkts });

              setOpen(false);
              setChoice("0");
            }}
            size="small"
            style={{
              color: "white",
              backgroundColor: "green",
            }}
            variant="extended"
          >
            <CheckRounded />
            &nbsp;&nbsp;CONFIRM&nbsp;&nbsp;
          </Fab>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const BucketView = ({
  buckets,
  highlights,
  changeHighlightBucket,
  updateBoard,
  deleteHighlight,
}) => {
  let rest = [];

  let bucketMapArray = {};
  if (buckets)
    buckets.forEach((bkt) => {
      bucketMapArray[bkt.id] = [];
    });

  highlights.forEach((highlight) => {
    if (!highlight.bucket || highlight.bucket.name === "") rest.push(highlight);
    else {
      if (!bucketMapArray[highlight.bucket.id])
        bucketMapArray[highlight.bucket.id] = [];
      bucketMapArray[highlight.bucket.id].push(highlight);
    }
  });

  return (
    <div style={{ display: "flex", marginLeft: "30px", width: "fit-content" }}>
      {Object.entries(bucketMapArray).map((bucket, index) => {
        return (
          <Bucket
            bucket={bucket}
            highlights={highlights}
            key={"bucket - " + index}
            index={index}
            buckets={buckets}
            onChange={changeHighlightBucket}
            updateBoard={updateBoard}
            deleteHighlight={deleteHighlight}
          />
        );
      })}
      <div
        style={{
          width: "250px",
          margin: "5px",
          marginTop: "5em",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px 0px 30px 0px",
        }}
      >
        <Typography style={{ fontSize: "1.2em", marginBottom: "20px" }}>
          Ungrouped
        </Typography>

        {rest.map((highlight, index) => {
          return (
            <HighlightCard
              highlight={highlight}
              key={highlight.id}
              buckets={buckets}
              alter={(config) => {
                console.log({ id: highlight.id, config });
                changeHighlightBucket(highlight.id, config);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BucketView;
