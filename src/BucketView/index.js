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
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Draggable from "react-draggable";

import { makeStyles } from "@mui/styles";

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

      console.log(rect);

      if (
        position.x > rect.x &&
        position.x < rect.x + rect.width &&
        position.y > rect.y &&
        position.y < rect.y + rect.height
      ) {
        return Object.entries(buckets)[i][0];
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

          console.log(bucket);

          if (bucket !== highlight.bucket) {
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

const Bucket = ({ bucket, index, buckets, onChange }) => {
  return (
    <div
      id={"bucket-container-" + index}
      style={{
        width: "250px",
        margin: "5px",
        marginTop: "5em",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "lightgrey",
        borderRadius: "5px",
        padding: "20px 0px 30px 0px",
      }}
    >
      <Typography style={{ fontSize: "1.2em" }}>{bucket[0]}</Typography>
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
    </div>
  );
};

const BucketView = ({ highlights, onChange }) => {
  let rest = [];

  let buckets = {};
  highlights.forEach((highlight) => {
    if (!highlight.bucket || highlight.bucket.trim() === "")
      rest.push(highlight);
    else {
      if (!buckets[highlight.bucket]) buckets[highlight.bucket] = [];

      buckets[highlight.bucket].push(highlight);
    }
  });

  return (
    <div style={{ display: "flex" }}>
      {Object.entries(buckets).map((bucket, index) => {
        return (
          <Bucket
            bucket={bucket}
            key={"bucket - " + index}
            index={index}
            buckets={buckets}
            onChange={onChange}
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
        <Typography style={{ fontSize: "1.2em" }}>Ungrouped</Typography>

        {rest.map((highlight, index) => {
          return (
            <HighlightCard
              highlight={highlight}
              key={highlight.id}
              buckets={buckets}
              alter={(config) => {
                onChange(highlight.id, config);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BucketView;
