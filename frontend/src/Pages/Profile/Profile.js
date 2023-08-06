import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import axios from "axios";

import { Container, Card, TextField, Button, Box, Typography, CircularProgress } from "@mui/material";


const Profile = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [formTitle, setFormTitle] = useState("Edit Profile");
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  }

  const [formData, setFormData] = useState({
    name: "",
    email: userData?.email,
    age: "",
    gender: "",
    phoneNumber: "",
    profileImage: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "profileImage") {
      if (event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      if (!file.type.includes("image/png") && !file.type.includes("image/jpeg") && !file.type.includes("image/jpg")) {
        alert("File type not allowed. Only PNG, JPG, and JPEG are allowed.");
        return;
      }
      if (file.size / 1024 / 1024 > 1) {
        alert("File size too large. Maximum allowed size is 1 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = function () {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profileImage: reader.result
        }));
      }
      reader.readAsDataURL(file);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    formData.email = userData.email;
    formData.age += "";
    // Send the POST request to the server
    axios
      .post(
        "https://qiuc1xjkaj.execute-api.us-east-1.amazonaws.com/dev/user/profile",
        formData
      )
      .then((response) => {
        navigate("/");
        alert("Profile data saeved");
      })
      .catch((error) => {
        console.error("Error saving profile data:", error);
      });
  };

  useEffect(() => {
    (async () => {
      await axios
        .get(
          "https://qiuc1xjkaj.execute-api.us-east-1.amazonaws.com/dev/user/profile?email=" +
          userData.email
        )
        .then((res) => {
          let data = {};
          console.log(res.data, typeof res.data.data);
          Object.keys(formData).forEach((key) => {
            data[key] = res.data[key];
          });
          setFormData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error?.response?.status === 404) {
            setFormTitle("Create Profile")
          } else {
            alert("error while fetching profile data");
          }
        });
    })();
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <Card sx={{ maxWidth: "600px", margin: "2rem auto" }}>
        {isLoading ? (<>
          <CircularProgress></CircularProgress>
          <h3>Loading Data</h3>
        </>) : (
          <Container component="div" maxWidth="sm">
            <form id="dashboard-form" onSubmit={handleSubmit}>
              <h1>{formTitle}</h1>
              <div>
                <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                  <Box sx={{ marginRight: '1rem' }}>
                    <Typography variant="h6">Profile Image</Typography>
                    {formData?.profileImage ? (
                      <img
                        src={formData?.profileImage}
                        alt="Profile"
                        style={{ width: "250px", height: "250px" }}
                      />
                    ) : (
                      <div style={{ width: "250px", height: "250px", border: "1px solid black" }}>
                        No Image
                      </div>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <input
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      type="file"
                      name="profileImage"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={handleChange}
                    />
                    <Button variant="contained" color="primary" onClick={handleButtonClick}>
                      Choose Image
                    </Button>
                  </Box>
                </Box>
                <TextField
                  sx={{ marginBottom: "1rem" }}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <TextField
                  label="Email"
                  variant="filled"
                  fullWidth
                  sx={{ marginBottom: "1rem" }}
                  name="email"
                  disabled
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <TextField
                  label="Age"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "1rem" }}
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div>
                <TextField
                  label="Gender"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "1rem" }}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              <div>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: "1rem" }}
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                sx={{ marginBottom: "1rem" }}
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Profile
              </Button>
            </form>
          </Container>
        )}

      </Card>
    </>
  );
};

export default Profile;
