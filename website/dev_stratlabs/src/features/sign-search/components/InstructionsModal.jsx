import { useState, forwardRef, useImperativeHandle } from "react";

import PropTypes from "prop-types";

// @mui material components
import { Switch, Modal, Divider, Slide } from "@mui/material";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

import SignVideo from "components/UI/SignVideo";

import { usePersistentConfig } from "hooks/usePersistentConfig";

const Instructions = forwardRef((props, ref) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [hideDontShowAgain, setHideDontShowAgain] = useState(false);
  const [show, setShow] = useState(false);

  const { setHideRecordingInstructionsOnLoad } = usePersistentConfig();

  const toggleDontShowAgain = () => {
    setDontShowAgain(!dontShowAgain);
  };

  const closeModal = () => {
    setHideRecordingInstructionsOnLoad(dontShowAgain);
    setShow(false);
  };

  useImperativeHandle(ref, () => ({
    showModal(visible = true, hideDontShowAgain = false) {
      setHideDontShowAgain(!!hideDontShowAgain);
      setShow(visible);
    },
  }));

  return (
    <Modal
      open={show}
      disableAutoFocus={true}
      onClose={closeModal}
      sx={{ display: "grid", placeItems: "center" }}
    >
      <Slide
        direction="down"
        in={show}
        timeout={500}
        sx={{ width: { xs: "auto", md: 500 }, margin: { xs: 1, md: 0 } }}
      >
        <MKBox
          position="relative"
          width="500px"
          display="flex"
          flexDirection="column"
          borderRadius="xl"
          bgColor="white"
          shadow="xl"
        >
          <MKBox display="flex" alignItems="center" justifyContent="space-between" p={2}>
            <MKTypography variant="h5">Instrucciones</MKTypography>
            <CloseIcon fontSize="medium" sx={{ cursor: "pointer" }} onClick={closeModal} />
          </MKBox>
          <Divider sx={{ my: 0 }} />
          <MKBox
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 150px)",
            }}
          >
            <MKBox p={2}>
              <MKTypography variant="body2" color="secondary" fontWeight="regular">
                Al dar clic en el botón INICIAR la cámara de tu computadora se prenderá y se
                mostrarán 3 recuadros para que ubiques tu rostro y las palmas de tus manos.
                <br />
                <br />
                Cuando te hayas ubicado correctamente, se mostrará un contador (3,2,1) y podrás
                realizar la seña a buscar en <u>dos segundos</u>.
                <br />
                <br />
                Recomendamos ubicarse aproximadamente a 80cm de la cámara.
              </MKTypography>
            </MKBox>
            <Divider sx={{ my: 0 }} />
            <SignVideo
              source={"https://isolatedsigns.s3.amazonaws.com/ABRIR-PUERTA.mp4"}
              style={{}}
            ></SignVideo>
          </MKBox>
          <MKBox display="flex" justifyContent="space-between" p={1.5}>
            {hideDontShowAgain ? (
              <div></div>
            ) : (
              <MKBox display="flex" alignItems="center">
                <Switch checked={dontShowAgain} onChange={toggleDontShowAgain} />
                <MKTypography
                  variant="button"
                  color="text"
                  fontWeight="regular"
                  ml={0}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                  onClick={toggleDontShowAgain}
                >
                  No volver a mostrar
                </MKTypography>
              </MKBox>
            )}

            <MKButton variant="gradient" color="info" onClick={closeModal}>
              Cerrar
            </MKButton>
          </MKBox>
        </MKBox>
      </Slide>
    </Modal>
  );
});

Instructions.propTypes = {
  showModal: PropTypes.bool,
};

export default Instructions;
