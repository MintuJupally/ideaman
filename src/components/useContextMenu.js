import { useEffect, useCallback, useState } from "react";

const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");

  const handleContextMenu = useCallback(
    (event) => {
      let temp = "";

      event.preventDefault();

      if (
        (event.target.ariaLabel &&
          event.target.ariaLabel.startsWith("highlight-card") &&
          (temp = event.target.ariaLabel.split("highlight-card-")[1])) ||
        (event.target.parentElement.ariaLabel &&
          event.target.parentElement.ariaLabel.startsWith("highlight-card") &&
          (temp =
            event.target.parentElement.ariaLabel.split(
              "highlight-card-"
            )[1])) ||
        (event.target.parentElement.parentElement.ariaLabel &&
          event.target.parentElement.parentElement.ariaLabel.startsWith(
            "highlight-card"
          ) &&
          (temp =
            event.target.parentElement.parentElement.ariaLabel.split(
              "highlight-card-"
            )[1]))
      ) {
        setAnchorPoint({ x: event.pageX, y: event.pageY });
        setShow(true);
        setId(temp);
      } else {
        setShow(false);
        setId(temp);
      }
    },
    [setShow, setAnchorPoint]
  );

  const handleMouseDown = useCallback(
    (event) => {
      if (show) {
        if (
          event.target.ariaLabel !== "context-menu" &&
          event.target.parentElement.ariaLabel !== "context-menu" &&
          event.target.parentElement.parentElement.ariaLabel !==
            "context-menu" &&
          event.target.parentElement.parentElement.parentElement.ariaLabel !==
            "context-menu"
        )
          setShow(false);
        else return;
      }

      let temp = "";

      event.stopPropagation();

      if (
        (event.target.ariaLabel &&
          event.target.ariaLabel.startsWith("highlight-card") &&
          (temp = event.target.ariaLabel.split("highlight-card-")[1])) ||
        (event.target.parentElement.ariaLabel &&
          event.target.parentElement.ariaLabel.startsWith("highlight-card") &&
          (temp =
            event.target.parentElement.ariaLabel.split(
              "highlight-card-"
            )[1])) ||
        (event.target.parentElement.parentElement.ariaLabel &&
          event.target.parentElement.parentElement.ariaLabel.startsWith(
            "highlight-card"
          ) &&
          (temp =
            event.target.parentElement.parentElement.ariaLabel.split(
              "highlight-card-"
            )[1]))
      )
        setId(temp);
      else setId(temp);
    },
    [show]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { anchorPoint, show, id };
};

export default useContextMenu;
