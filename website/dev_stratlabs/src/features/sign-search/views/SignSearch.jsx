/* eslint-disable no-debugger */
import { useState, forwardRef, useRef, useEffect, useImperativeHandle } from "react";

import PropTypes from "prop-types";

// @mui material components
import {
  Container,
  Grid,
  Card,
  InputAdornment,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  CardActions,
  Skeleton,
} from "@mui/material";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// @mui icons
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import InfoIcon from "@mui/icons-material/Info";

import PageHeaderContainer from "components/UI/PageHeaderContainer";
import InstructionsModal from "../components/InstructionsModal";
import RecordSignModal from "../components/RecordSignModal";

import { useNotification } from "contextProviders/NotificationContext";
import { useSignSearchService } from "../sign-search.services";
import { usePersistentConfig } from "hooks/usePersistentConfig";

function SignSearch() {
  const signSearchService = useSignSearchService();
  const notification = useNotification();

  const { hideRecordingInstructionsOnLoad, showRecordingDebugInfo } = usePersistentConfig();

  const instructionsModalRef = useRef(null);
  const recordSignModalRef = useRef(null);
  const recordings = useRef([]);

  const [recordingsState, setRecordingsState] = useState([]);

  const processRecordedSign = async (data) => {
    await signSearchService
      .uploadLandmarks(data.landmarks)
      .then((r) => {
        data.processingSigns = false;
        data.signs = r;
      })
      .catch((ex) => {
        notification.open({
          title: "Ha ocurrido un error",
          subTitle: "",
          type: "error",
        });
      })
      .finally(() => {
        data.processingSigns = false;
      });
    setRecordingsState((prevState) =>
      prevState.map((r) => {
        if (r.uuid == data.uuid) return data;
        return r;
      })
    );
  };

  const onRecorded = (data) => {
    data.processingSigns = true;
    data.signs = [];
    recordings.current.unshift(data);
    setRecordingsState([data, ...recordingsState]);
    processRecordedSign(data);
  };

  useEffect(() => {
    if (!hideRecordingInstructionsOnLoad) {
      instructionsModalRef.current.showModal(true, false);
    }
  }, [instructionsModalRef]);

  return (
    <>
      <InstructionsModal ref={instructionsModalRef}></InstructionsModal>
      <RecordSignModal ref={recordSignModalRef} onRecorded={onRecorded}></RecordSignModal>

      <PageHeaderContainer>
        <MKTypography
          variant="h1"
          color="white"
          mt={-6}
          mb={1}
          sx={({ breakpoints, typography: { size } }) => ({
            [breakpoints.down("md")]: {
              fontSize: size["3xl"],
            },
          })}
        >
          Búsqueda por Seña
        </MKTypography>
        <MKTypography
          variant="body1"
          color="white"
          textAlign="center"
          px={{ xs: 6, lg: 12 }}
          mt={1}
          mb={5}
        >
          Utiliza la cámara para grabar e intepretar una seña.
        </MKTypography>
        <div>
          <MKButton size="large" onClick={() => recordSignModalRef.current.showModal(true)}>
            <RadioButtonCheckedIcon fontSize="medium" className="countdown-pulse" sx={{ mr: 1 }} />
            Grabar seña
          </MKButton>
          <MKButton
            size="large"
            onClick={() => instructionsModalRef.current.showModal(true, true)}
            sx={{ ml: 1 }}
          >
            <InfoIcon fontSize="medium" sx={{ mr: 1 }} />
            Instrucciones
          </MKButton>
        </div>
      </PageHeaderContainer>

      <Container>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {recordings.current.map((r, i) => (
            <Grid item xs={12} md={6} lg={4} key={r.uuid}>
              <Card sx={{}}>
                <video
                  style={{ borderRadius: "0.75rem 0.75rem 0 0", width: "100%" }}
                  key={r.uuid}
                  src={r.mediaUrl}
                  loop={true}
                  controls={true}
                ></video>
                {r.processingSigns ? (
                  <LinearProgress
                    variant="indeterminate"
                    value={true}
                    sx={{ width: "100%", overflow: "hidden", height: 4 }}
                  ></LinearProgress>
                ) : (
                  <MKBox sx={{ width: "100%", overflow: "hidden", height: 4 }}></MKBox>
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {r.processingSigns ? "Cargando resultados..." : "Resultados"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.processingSigns ? (
                      <MKBox>
                        <Skeleton variant="text" sx={{ width: "60%" }}></Skeleton>
                        <Skeleton variant="text" sx={{ width: "40%" }}></Skeleton>
                        <Skeleton variant="text" sx={{ width: "50%" }}></Skeleton>
                        <Skeleton variant="text" sx={{ width: "70%" }}></Skeleton>
                        <Skeleton variant="text" sx={{ width: "40%" }}></Skeleton>
                      </MKBox>
                    ) : (
                      <MKBox sx={{ pl: 2 }}>
                        <ul>
                          {r.signs.map((s) => (
                            <li key={s.word}>{s.word}</li>
                          ))}
                        </ul>
                      </MKBox>
                    )}
                  </Typography>
                </CardContent>
                {showRecordingDebugInfo && (
                  <CardActions style={{ justifyContent: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Landmarks: {r.landmarks.length} | Media chunks: {r.media.length}
                    </Typography>
                  </CardActions>
                )}
                {false && (
                  <CardActions>
                    <Button size="small">Botón A</Button>
                    <Button size="small">Botón B</Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default SignSearch;
