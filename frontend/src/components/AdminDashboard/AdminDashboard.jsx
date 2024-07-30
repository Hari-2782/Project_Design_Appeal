import React from "react";
import { Container, Box, Toolbar } from "@mui/material";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
// import AdminNavbar from '../AdminNavbar/AdminNavbar';
import AdminCards from "../AdminCards/AdminCards";
import AdminCharts from "../AdminCharts/AdminCharts";
import AdminTable from "../AdminTable/AdminTable";

function AdminDashboard() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <AdminNavbar />
          <Container>
            {/* <Box mt={4}>
            <AdminCards />
          </Box>
          <Box mt={4}>
            <AdminCharts />
          </Box>
          <Box mt={4}>
            <AdminTable />
          </Box> */}
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default AdminDashboard;
