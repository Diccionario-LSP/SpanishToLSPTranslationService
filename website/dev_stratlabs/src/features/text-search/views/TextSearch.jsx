import React, { useState } from "react";

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
  Divider,
} from "@mui/material";
// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";

import PageHeaderContainer from "components/UI/PageHeaderContainer";
import PageContentContainer from "components/UI/PageContentContainer";

import { styled } from "@mui/material/styles";
import { useNotification } from "contextProviders/NotificationContext";
import { useTextSearchService } from "../text-search.services";

const SearchTextField = styled(MKInput)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
});

function TextSearch() {
  const textSearchService = useTextSearchService();
  const notification = useNotification();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const onSearch = () => {
    setSearching(true);
    textSearchService
      .search(query)
      .then((r) => {
        setResults(r);
      })
      .catch((ex) => {
        notification.open({
          title: "Ha ocurrido un error",
          subTitle: "",
          type: "error",
        });
      })
      .finally(() => {
        setSearching(false);
      });
  };

  return (
    <>
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
          Búsqueda en Español
        </MKTypography>
        <MKTypography
          variant="body1"
          color="white"
          textAlign="center"
          px={{ xs: 6, lg: 12 }}
          mt={1}
          mb={5}
        >
          Encuentra las señas por palabra clave. Utiliza el buscador para encontrar la seña.
        </MKTypography>
        <div>
          <SearchTextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ width: "100%" }}
            variant="outlined"
            InputProps={{
              sx: { fontSize: "x-large" },
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment>
                  <MKButton variant="contained" color="light" onClick={onSearch} loading={true}>
                    Buscar
                  </MKButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          ></SearchTextField>
          {searching ? (
            <LinearProgress
              variant="indeterminate"
              value={searching}
              sx={{ width: "100%", overflow: "hidden", mt: "4px", height: 4 }}
            ></LinearProgress>
          ) : (
            <MKBox sx={{ width: "100%", overflow: "hidden", mt: "4px", height: 4 }}></MKBox>
          )}
        </div>
      </PageHeaderContainer>

      <Container>
        {results && results.length == 0 && (
          <Typography
            variant="h5"
            color="#fff"
            style={{ textAlign: "center", marginBottom: "100px" }}
          >
            No se encontraron resultados
          </Typography>
        )}

        <Grid container spacing={3} alignItems="center">
          {results &&
            results.map((result) => (
              <>
                <Grid item xs={12} md={6} lg={4} key={result.key}>
                  {true && (
                    <Card sx={{}}>
                      <video
                        style={{ borderRadius: "0.75rem 0.75rem 0 0", width: "100%" }}
                        src={result.wordVideoUrl}
                        loop={true}
                        controls={true}
                      ></video>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {result.word}
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                          {result.phrase}
                        </Typography>
                      </CardContent>
                      <video
                        style={{ borderRadius: "0 0 0.75rem 0.75rem", width: "100%" }}
                        src={result.phraseVideoUrl}
                        loop={true}
                        controls={true}
                      ></video>
                    </Card>
                  )}
                  {false && (
                    <Card sx={{}}>
                      <CardActionArea>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {result.word}
                          </Typography>

                          <video
                            style={{ borderRadius: "0.75rem 0.75rem 0 0", width: "100%" }}
                            src={result.wordVideoUrl}
                            loop={true}
                            controls={true}
                          ></video>

                          <Typography gutterBottom variant="h6" component="div">
                            Uso en contexto
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {result.phrase}
                          </Typography>

                          <video
                            style={{ borderRadius: "0.75rem 0.75rem 0 0", width: "100%" }}
                            src={result.phraseVideoUrl}
                            loop={true}
                            controls={true}
                          ></video>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  )}
                </Grid>
              </>
            ))}
        </Grid>
      </Container>
    </>
  );
}

export default TextSearch;
