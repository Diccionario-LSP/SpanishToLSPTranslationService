import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography"
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

SignVideoPhrase.propTypes = {
  source: PropTypes.string,
  phrase: PropTypes.string,
  style: PropTypes.object,
};

function SignVideoPhrase({ source, phrase, style, ...rest }) {
  const videoRef = useRef(null);
  const [available, setAvailable] = useState(true);
  const [hover, setHover] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.addEventListener("play", () => {
        setIsPlaying(true);
      });
      videoRef.current.addEventListener("pause", () => {
        setIsPlaying(false);
      });
    }
  }, [videoRef]);

  // resize the height of the text depending on the heigh of the video
  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        setVideoHeight(videoRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const play = () => {
    if (available) videoRef.current.play();
  };

  return (
    <>
        <Grid container spacing={1} alignItems="center" >
            <Grid item xs={6} md={6} lg={6}>
                <div style={{ position: "relative", lineHeight: "1rem", aspectRatio: "16 / 9"}}>
                    <video
                    ref={videoRef}
                    onMouseEnter={(e) => setHover(true)}
                    onMouseLeave={(e) => setHover(false)}
                    onError={(e) => setAvailable(false)}
                    onLoadedMetadata={() => {
                        setAvailable(true);
                        setVideoHeight(videoRef.current.clientHeight);
                      }}
                    style={{ width: "100%", ...style }}
                    src={source}
                    loop={true}
                    controls={hover && isPlaying}
                    {...rest}
                    ></video>
                    {!isPlaying && (
                    <div
                        style={{
                        position: "absolute",
                        left: 0,
                        width: "100%",
                        top: 0,
                        height: "100%",

                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        cursor: available ? "pointer" : "default",
                        }}
                        onMouseEnter={(e) => setHover(true)}
                        onMouseLeave={(e) => setHover(false)}
                        onClick={() => play()}
                    >
                        {available ? (
                        <div
                            style={{
                            zIndex: 100,
                            textAlign: "center",
                            backgroundColor: "#000000a0",
                            borderRadius: "50%",
                            }}
                        >
                            <PlayArrowIcon fontSize="large" color="light"></PlayArrowIcon>
                        </div>
                        ) : (
                        <MKTypography variant="body2" fontSize="small">
                            Video no disponible
                        </MKTypography>
                        )}
                    </div>
                    )}
                </div>
            </Grid>
            <Grid item xs={6} md={6} lg={6} style={{ textAlign: 'left', paddingRight: '8px', maxHeight: videoHeight, overflowY: 'auto'}}>
                <Typography variant="body2" color="text.secondary">
                {phrase}
                </Typography>
            </Grid>
        </Grid>
    </>
  );
}

export default SignVideoPhrase;
