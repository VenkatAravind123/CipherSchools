import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminLayout.scss";
import { MdOutlineAssignment } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { IoIosAlbums } from "react-icons/io";

export default function AdminLayout(){
    const items = [
        {to:"/admin",label:"Dashboard",icon:<RxDashboard/>,end:true},
        {to:"/admin/assignments",label:"Assignments",icon:<MdOutlineAssignment />},
        {to:"/admin/users",label:"Users",icon:<CgProfile />},
        {to:"/admin/profile",label:"Profile",icon:<IoIosAlbums />},
    ]

    return(
        <div className="shell">
            <Sidebar title="SQLStudio" items={items}/>
            <main className="shell__main">
                <Outlet/>
            </main>
        </div>
    )
}