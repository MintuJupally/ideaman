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

import { makeStyles } from "@mui/styles";

import { Rnd } from "react-rnd";

import Menu from "../components/Menu";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const useStyles = makeStyles((theme) => ({
  highlight: {
    height: "200px",
    width: "160px",
    padding: "20px",
    boxSizing: "border-box",
    position: "absolute",
  },
}));

const HighlightCard = ({ highlight, alter, focus }) => {
  const classes = useStyles();

  return (
    <Rnd
      size={{ width: highlight.w, height: highlight.h }}
      position={{ x: highlight.x, y: highlight.y }}
      onDragStop={(e, d) => {
        alter({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        alter({
          w: ref.style.width,
          h: ref.style.height,
          ...position,
        });
      }}
    >
      <Card
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: highlight.bgColor,
          color: highlight.color,
          boxShadow: focus
            ? "0px 0x 5px 5px blue !important"
            : "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        }}
        className={classes.highlight}
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
    </Rnd>
  );
};

const BoardView = ({ highlights, updateHighlight, deleteHighlight }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState("");
  const [comp, setComp] = useState(null);
  const [editComp, setEditComp] = useState(null);
  const [focus, setFocus] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(edit !== "");
  }, [edit]);

  useEffect(() => {
    if (!open) {
      setComp(null);
    } else setComp(highlights.find((el) => el.id === edit));
  }, [open]);

  useEffect(() => {
    setEditComp(comp);
  }, [comp]);

  return (
    <div>
      {highlights.map((highlight) => {
        return (
          <HighlightCard
            highlight={highlight}
            key={highlight.id}
            focus={focus === highlight.id}
            alter={(config) => {
              updateHighlight(highlight.id, config);
            }}
          />
        );
      })}

      <Menu
        onDelete={deleteHighlight}
        focus={focus}
        updateFocus={(id) => {
          setFocus(id);
        }}
        updateEdit={(id) => {
          if (edit !== id) setEdit(id);
          else setOpen(true);
        }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Highlight</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="title"
            label="Ttile"
            type="text"
            fullWidth
            variant="outlined"
            value={comp ? comp.title : ""}
            onChange={(event) => {
              setComp({ ...comp, title: event.target.value });
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="body"
            label="Body"
            type="text"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={comp ? comp.body : ""}
            onChange={(event) => {
              setComp({ ...comp, body: event.target.value });
            }}
          />
          <TextField
            margin="dense"
            id="bucket-select"
            label="Bucket"
            type="text"
            fullWidth
            variant="outlined"
            value={comp && comp.bucket ? comp.bucket : ""}
            onChange={(event) => {
              setComp({ ...comp, bucket: event.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Fab
            onClick={() => {
              handleClose();

              setEditComp(comp);
            }}
            color="error"
            variant="extended"
            size="small"
            style={{ color: "red", backgroundColor: "white" }}
          >
            <CloseRoundedIcon />
            &nbsp;&nbsp;CANCEL&nbsp;&nbsp;
          </Fab>
          <Fab
            onClick={() => {
              updateHighlight(comp.id, { ...comp });

              handleClose();
            }}
            size="small"
            style={{ color: "white", backgroundColor: "green" }}
            variant="extended"
          >
            <CheckRoundedIcon />
            &nbsp;&nbsp;SAVE&nbsp;&nbsp;
          </Fab>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BoardView;
