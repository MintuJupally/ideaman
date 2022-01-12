import { useState, useEffect } from "react";
import { Card, IconButton } from "@mui/material";
import useContextMenu from "./useContextMenu";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const Menu = ({ onDelete, updateFocus, updateEdit }) => {
  let { anchorPoint, show, id } = useContextMenu();
  const [showMenu, setShowMenu] = useState(show);

  useEffect(() => {
    setShowMenu(show);
  }, [show]);

  useEffect(() => {
    console.log({ id });

    updateFocus(id);
  }, [id]);

  if (showMenu) {
    return (
      <Card
        className="menu"
        aria-label="context-menu"
        style={{ top: anchorPoint.y, left: anchorPoint.x }}
      >
        <IconButton
          onClick={() => {
            updateEdit(id);

            setShowMenu(false);
          }}
        >
          <EditOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            onDelete(id);

            setShowMenu(false);
          }}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Card>
    );
  }
  return null;
};

export default Menu;
