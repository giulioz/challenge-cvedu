import React, { useState, useRef, useCallback, useMemo } from "react";
import { useAutoMemo, useAutoCallback, useAutoEffect } from "hooks.macro";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { DiGithubBadge } from "react-icons/di";

import { templatesInitial } from "./templates";
import { usePeriodicRerender, usePersistState } from "./utils";
import { getFunctionFromCode } from "./codeUtils";
import { maskToImageData, accumulatorToImageData } from "./videoUtils";
import BlockEditor from "./components/BlockEditor";
import {
  NumberIOHelper,
  StringIOHelper,
  ImageIOHelper,
  MaskIOHelper,
} from "./components/IOPortsHelpers";
import { InputDialog } from "./components/InputDialog";
import CodeEditor from "./components/CodeEditor";
import CanvasOutput from "./components/CanvasOutput";
import { useTemplates } from "./api/hooks";
import { initialBlocksPos, initialBlocks, initialLinks } from "./initialState";
import apiCall from "./api/apiCall";
import {
  CVBlockInfo,
  CVIOPortInfo,
  Block,
  Link,
  IOPortInst,
} from "@challenge-cvedu/common";

import "./globalStyles.css";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#e53935",
    },
    // primary: blue,
    secondary: blue,
  },
  overrides: { MuiAppBar: { root: { zIndex: null as any } } },
});

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
  topButton: {
    margin: theme.spacing(1),
  },
  containerVert: {
    width: "100%",
    height: "calc(100% - 52px)",
  },
  containerHoriz: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
    width: "100%",
    height: "60%",
    display: "flex",
    flexDirection: "row",
  },
  containerHorizSM: {
    width: "100%",
    height: "40%",
    display: "flex",
    flexDirection: "row",
  },
  containerHorizHalf: {
    flex: 1,
    flexBasis: 0,
  },
  containerHorizHalfCanvas: {
    flex: 1,
    flexBasis: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function IntroDialog() {
  const [open, setOpen] = useState(true);
  const handleClose = useAutoCallback(() => setOpen(false));

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Welcome to CVEDU!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Develop your Computer Vision algorithms as blocks, connecting them
          using your mouse. You can edit block's code clicking on them, using
          the embedded editor.
          <br />
          <br />
          The blocks are already configured for a Chrome Key example. You have
          to complete the code for ChromaKeyUV and ChromaComposite. Someone said
          that <b>ChromaComposite</b> is the hardest, test your programming
          skills!
          <br />
          <br />
          If you feel really stuck you can <b>download the solution</b> from the
          server.{" "}
          <i>
            Ask the teacher for the password, and please don't cheat! The
            password is impossible to guess!
          </i>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function App() {
  const classes = useStyles({});

  const [currentError, setCurrentError] = useState<string | null>(null);
  const handleError = useAutoCallback(function handleError(error: any) {
    if (String(error) !== currentError) {
      setCurrentError(String(error));
    }
  });
  function handleCloseError() {
    setCurrentError(null);
  }

  const templates = useTemplates(templatesInitial);

  const [addBlockDialogOpen, setAddBlockDialogOpen] = useState(false);
  const handleOpenAddBlockDialog = useCallback(
    () => setAddBlockDialogOpen(true),
    [setAddBlockDialogOpen]
  );
  const handleAbortAddBlockDialog = useCallback(
    () => setAddBlockDialogOpen(false),
    [setAddBlockDialogOpen]
  );
  const handleAddBlock = useCallback(() => {
    // setTemplates(t => [
    //   ...t,
    //   {
    //     type: buildingBlockName,
    //     hardcoded: false,
    //     code: formatCode(`function ${buildingBlockName}({Input}) {return {}}`),
    //     inputs: [{ label: "Input", uuid: `${buildingBlockName}-Input-input` }],
    //     outputs: [
    //       { label: "Output", uuid: `${buildingBlockName}-Output-output` },
    //     ],
    //   },
    // ]);
    // setAddBlockDialogOpen(false);
  }, []);

  const [blocks, setBlocks] = useState<Block<CVBlockInfo, CVIOPortInfo>[]>(
    initialBlocks
  );
  const reHydrateBlocks = useCallback(
    (blocks: Block<CVBlockInfo, CVIOPortInfo>[]) => {
      const nBlocks = blocks.map(b => ({
        ...templates.find(t => t.type === b.type),
        ...b,
        inputs: b.inputs,
        outputs: b.outputs,
        fn: code && getFunctionFromCode(b.code),
      }));
      setBlocks(nBlocks);
    },
    [templates]
  );
  usePersistState(blocks, reHydrateBlocks, "blocks");

  const [blocksPos, setBlocksPos] = useState<
    { uuid: string; x: number; y: number }[]
  >(initialBlocksPos);
  usePersistState(blocksPos, setBlocksPos, "blocksPos");

  const [links, setLinks] = useState<(Link<CVIOPortInfo> | false)[]>(
    initialLinks as any
  );
  usePersistState(links, setLinks, "links");
  useAutoEffect(() => {
    if (!links.every(l => l !== false)) {
      setCurrentError("Incompatible Types");
    }
  });
  const validLinks: Link<CVIOPortInfo>[] = useAutoMemo(
    () => links.filter(l => l !== false) as Link<CVIOPortInfo>[]
  );

  const handleUpdateLinks = useAutoCallback(
    (fn: (prev: Link<CVIOPortInfo>[]) => Link<CVIOPortInfo>[]) => {
      function linkValid(link: Link<CVIOPortInfo>) {
        if (!link.dst || !link.src.valueType) {
          return true;
        } else if (link.src.valueType !== link.dst.valueType) {
          return false;
        } else {
          return true;
        }
      }

      setLinks(old => {
        const newLinks = fn(
          old.filter(l => l !== false) as Link<CVIOPortInfo>[]
        );
        return newLinks.map(l => (linkValid(l) ? l : false));
      });
    }
  );

  const [customValues, setCustomValues] = useState<any>({});
  usePersistState(customValues, setCustomValues, "customValues");

  const handleClearAll = useAutoCallback(() => {
    setBlocks([]);
    setBlocksPos([]);
    setLinks([]);
    setCustomValues({});
  });

  const [selectedBlockID, setSelectedBlockID] = useState<string | null>(null);
  const selectedBlock = blocks.find(b => b.uuid === selectedBlockID);
  const code = selectedBlock ? selectedBlock.code : "";

  const handleRun = useAutoCallback((code: string) => {
    setBlocks(blocks =>
      blocks.map(b => {
        if (b.uuid === selectedBlockID) {
          try {
            const fn = getFunctionFromCode(code);
            return { ...b, code, fn };
          } catch (e) {
            setCurrentError(String(e));
          }

          return b;
        } else {
          return b;
        }
      })
    );
  });

  const handleReset = useAutoCallback(() => {
    setBlocks(blocks =>
      blocks.map(b => {
        if (b.uuid === selectedBlockID) {
          try {
            const code = templates.find(t => t.type === b.type)?.code;
            const fn = code && getFunctionFromCode(code);
            return code && fn ? { ...b, code, fn } : b;
          } catch (e) {
            setCurrentError(String(e));
          }

          return b;
        } else {
          return b;
        }
      })
    );
  });

  const [solutionPasswordDialogOpen, setSolutionPasswordDialogOpen] = useState<
    boolean | "wrong"
  >(false);
  const handleOpenSolutionPasswordDialog = useCallback(
    () => setSolutionPasswordDialogOpen(true),
    [setSolutionPasswordDialogOpen]
  );
  const handleAbortSolutionPasswordDialog = useCallback(
    () => setSolutionPasswordDialogOpen(false),
    [setSolutionPasswordDialogOpen]
  );
  const handleSolution = useAutoCallback(async (password: string) => {
    try {
      const result = await apiCall("POST /solutions/:type", {
        params: { type: selectedBlock.type },
        body: { password },
      });

      if (result.status === "ok") {
        setBlocks(blocks =>
          blocks.map(b => {
            if (b.uuid === selectedBlockID) {
              try {
                const code = result.data;
                const fn = code && getFunctionFromCode(code);
                return code && fn ? { ...b, code, fn } : b;
              } catch (e) {
                setCurrentError(String(e));
              }

              return b;
            } else {
              return b;
            }
          })
        );
        setSolutionPasswordDialogOpen(false);
      } else {
        setSolutionPasswordDialogOpen("wrong");
      }
    } catch (e) {
      setSolutionPasswordDialogOpen("wrong");
      console.error(e);
    }
  });

  const tempResultsRef = useRef<{ [key: string]: { [key: string]: any } }>({});

  const { frameOutputName, blockToDisplay } = useAutoMemo(() => {
    const blockToDisplay = blocks.find(b => b.uuid === selectedBlockID);
    const frameOutputName =
      blockToDisplay &&
      blockToDisplay.outputs.find(
        o =>
          o.valueType === "imagedata" ||
          o.valueType === "mask" ||
          o.valueType === "accumulator"
      );
    return { frameOutputName, blockToDisplay };
  });

  const handleFrame = useAutoCallback(function handleFrame(
    imgData: ImageData
  ): ImageData | null {
    if (currentError) return null;

    tempResultsRef.current = {};

    function getNodeParams(b: Block<CVBlockInfo, CVIOPortInfo>) {
      if (!b) return false;

      const params: any = {};
      b.inputs.forEach(i => (params[i.label] = null));

      const inLinks = validLinks.filter(
        l => l.dst && b.uuid === l.dst.blockUuid
      );
      inLinks.forEach(({ src, dst }) => {
        if (
          dst &&
          tempResultsRef.current[src.blockUuid] &&
          tempResultsRef.current[src.blockUuid][src.label] !== null
        ) {
          params[dst.label] = tempResultsRef.current[src.blockUuid][src.label];
        }
      });

      if (b.inputs.every(i => params[i.label] !== null)) {
        return params;
      } else {
        return false;
      }
    }

    const startNodes = blocks.filter(b => b.inputs.length === 0);
    const queue = startNodes.map(b => ({ block: b, params: {} as any }));
    while (queue.length > 0) {
      const { block, params } = queue.shift()!;

      if (block.hardcoded || block.fn) {
        if (block.type === "CameraInput") {
          tempResultsRef.current[block.uuid] = { Frame: imgData };
        } else if (block.customInput) {
          tempResultsRef.current[block.uuid] = {
            ...customValues[block.uuid],
          };
        } else if (block.type === "DisplayFrame") {
          tempResultsRef.current[block.uuid] = { Frame: params["Frame"] };
        } else if (params && !block.hardcoded) {
          tempResultsRef.current[block.uuid] = block.fn(params);
        }

        if (params) {
          const outLinks = validLinks.filter(
            l => l.src && l.src.blockUuid === block.uuid
          );

          const outBlocks = [
            ...new Set(
              outLinks.map(l => l.dst && l.dst.blockUuid).filter(uuid => uuid)
            ),
          ].map(uuid => blocks.find(b => b.uuid === uuid));

          const outBlocksWithParams = outBlocks
            .map(b => ({
              block: b,
              params: b !== undefined && getNodeParams(b),
            }))
            .filter(b => b.params);

          outBlocksWithParams.forEach(b => queue.push(b as any));
        }
      }
    }

    if (
      blockToDisplay &&
      frameOutputName &&
      tempResultsRef.current[blockToDisplay.uuid]
    ) {
      if (frameOutputName.valueType === "imagedata") {
        return tempResultsRef.current[blockToDisplay.uuid][
          frameOutputName.label
        ];
      }

      if (frameOutputName.valueType === "mask") {
        return maskToImageData(
          tempResultsRef.current[blockToDisplay.uuid][frameOutputName.label]
        );
      }

      if (frameOutputName.valueType === "accumulator") {
        return accumulatorToImageData(
          tempResultsRef.current[blockToDisplay.uuid][frameOutputName.label]
        );
      }
    }

    const displayBlock = blocks.find(b => b.type === "DisplayFrame");
    if (displayBlock && tempResultsRef.current[displayBlock.uuid]) {
      return tempResultsRef.current[displayBlock.uuid]["Frame"];
    }

    return null;
  });

  // To allow deferred IO Decoration update
  const updateIndex = usePeriodicRerender(100);

  const renderIODecoration = useCallback(
    (port: IOPortInst<CVIOPortInfo>) => {
      const value =
        tempResultsRef.current[port.blockUuid] &&
        tempResultsRef.current[port.blockUuid][port.label];

      if (port.type === "output" && value !== null && value !== undefined) {
        switch (port.valueType) {
          case "number":
            return <NumberIOHelper value={value} />;
          case "string":
            return <StringIOHelper value={value} />;
          case "imagedata":
            return <ImageIOHelper value={value} />;
          case "mask":
            return <MaskIOHelper value={value} />;

          default:
            return null;
        }
      } else {
        return null;
      }
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [tempResultsRef, updateIndex]
  );

  const customRendererParams = useAutoMemo(() => ({
    customValues,
    setCustomValues,
  }));

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {useAutoMemo(() => (
          <AppBar position="static">
            <IntroDialog />

            <Toolbar variant="dense">
              <Typography variant="h6" className={classes.title}>
                Block Editor
              </Typography>
              <Button
                startIcon={<DeleteForeverIcon />}
                onClick={handleClearAll}
                variant="outlined"
                className={classes.topButton}
              >
                Clear All
              </Button>
              <Button
                startIcon={<DiGithubBadge />}
                variant="outlined"
                component="a"
                href="http://www.github.com/giulioz/cvedu"
                className={classes.topButton}
              >
                About
              </Button>
            </Toolbar>
          </AppBar>
        ))}

        <div className={classes.containerVert}>
          <div className={classes.containerHoriz}>
            <div className={classes.containerHorizHalfCanvas}>
              <CanvasOutput
                handler={handleFrame}
                onError={handleError}
                title={
                  blockToDisplay && frameOutputName
                    ? `Output for ${blockToDisplay.type}`
                    : "Output"
                }
              />
            </div>
            <div className={classes.containerHorizHalf}>
              <CodeEditor
                initialCode={code}
                onRun={handleRun}
                onReset={handleReset}
                onSolution={handleOpenSolutionPasswordDialog}
                onError={handleError}
              />
            </div>
          </div>
          <div className={classes.containerHorizSM}>
            <BlockEditor
              blocks={blocks}
              setBlocks={setBlocks}
              blocksPos={blocksPos}
              setBlocksPos={setBlocksPos}
              links={validLinks}
              setLinks={handleUpdateLinks}
              templates={templates}
              onAdd={handleOpenAddBlockDialog}
              selectedBlock={selectedBlockID}
              onSelectBlock={setSelectedBlockID}
              renderIODecoration={renderIODecoration}
              customParams={customRendererParams}
            />
          </div>
        </div>

        <InputDialog
          open={addBlockDialogOpen}
          title="Add a new Block"
          actionLabel="Add"
          cancelLabel="Cancel"
          fieldLabel="Name"
          onAbort={handleAbortAddBlockDialog}
          onAccept={handleAddBlock}
        />

        <InputDialog
          open={Boolean(solutionPasswordDialogOpen)}
          title={
            solutionPasswordDialogOpen === "wrong"
              ? "Wrong Password!"
              : "Insert password for solution"
          }
          actionLabel="Check"
          cancelLabel="Cancel"
          fieldLabel="Password"
          onAbort={handleAbortSolutionPasswordDialog}
          onAccept={handleSolution}
        />

        {useAutoMemo(() => (
          <Snackbar open={Boolean(currentError)} onClose={handleCloseError}>
            <Alert
              severity="error"
              elevation={6}
              variant="filled"
              onClose={handleCloseError}
            >
              <AlertTitle>Error:</AlertTitle>
              <pre>{currentError}</pre>
            </Alert>
          </Snackbar>
        ))}
      </ThemeProvider>
    </>
  );
}
