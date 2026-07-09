var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/initialPlayers.ts
var INITIAL_PLAYERS = [
  {
    id: "p1",
    name: "Kumuda",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 70,
    football: 0,
    tableTennis: 0,
    skillRating: 28,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Kumuda%20Pic_Kumuda%20Bopaiah.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p2",
    name: "sachin s shivabugadi",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 0,
    skillRating: 32,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/DSC_1103%20copy_Sachin%20Shambhaji%20Shi%202.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p3",
    name: "Ragul Murugan",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_7646_Ragul%20M.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p4",
    name: "Mohit B",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 95,
    skillRating: 63,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Mohit_Mohit%20B%201.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p5",
    name: "Akash Sharma",
    role: "",
    badminton: 70,
    carroms: 95,
    cricket: 70,
    football: 40,
    tableTennis: 95,
    skillRating: 74,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/1000127508_Akash%20Sharma%201.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p6",
    name: "Deepak Kumar Pandit",
    role: "",
    badminton: 70,
    carroms: 95,
    cricket: 0,
    football: 0,
    tableTennis: 95,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/815ba595-a9fe-4970-9b90-4b50d64fd4c7_Deepak%20Kumar%20Pandit%201.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p7",
    name: "Dhananjay Dharne",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/DJ_Dhananjay%20Suhas%20Dhar.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p8",
    name: "Keerthana B R",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 40,
    football: 40,
    tableTennis: 70,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-07-06%20at%2012.49.38_Keerthana%20B%20R.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p9",
    name: "Sanjai N",
    role: "",
    badminton: 0,
    carroms: 95,
    cricket: 95,
    football: 70,
    tableTennis: 0,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_2026_Sanjai%20N.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p10",
    name: "Kiran Antony",
    role: "",
    badminton: 0,
    carroms: 70,
    cricket: 70,
    football: 70,
    tableTennis: 0,
    skillRating: 42,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_0293%20(1)_Kiran%20Antony.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p11",
    name: "BINU PAUL",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 40,
    football: 70,
    tableTennis: 40,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/ABLR0507%20BinuPaul_Binu%20Paul.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p12",
    name: "Dileep Kumar G",
    role: "",
    badminton: 95,
    carroms: 70,
    cricket: 95,
    football: 40,
    tableTennis: 70,
    skillRating: 74,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Dileep_Kumar_Dileep%20Kumar%20G%20Reddy.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p13",
    name: "Rani Devi",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 40,
    football: 0,
    tableTennis: 40,
    skillRating: 38,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/20230927193243_IMG_3472_Rani%20Devi.JPG",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p14",
    name: "Venkat Ravada",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/venkat-id-card_Ravada%20Venkataramana.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p15",
    name: "Vishnu Benny",
    role: "",
    badminton: 0,
    carroms: 70,
    cricket: 95,
    football: 70,
    tableTennis: 70,
    skillRating: 61,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_4699_Vishnu%20Benny.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p16",
    name: "Anoop Kumar Mittapelli",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 95,
    football: 0,
    tableTennis: 40,
    skillRating: 43,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/1758718530466_Anoop%20Kumar%20Mittapel.pdf",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p17",
    name: "Madhumurthy K",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/MadhuKollu_Photo_Madhu%20Murthy%20Kollu.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p18",
    name: "Saurabh Negi",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 70,
    skillRating: 64,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/PassPortPic_Saurabh%20Negi.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p19",
    name: "AKHIL M S",
    role: "",
    badminton: 95,
    carroms: 70,
    cricket: 95,
    football: 70,
    tableTennis: 70,
    skillRating: 80,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_4595_Akhil%20MS.JPG",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p20",
    name: "Praveen Kumar",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Praveen%20Kumar_Praveen%20Kumar%20Bhaska.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p21",
    name: "Aditya Mehta",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 70,
    skillRating: 64,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-06-29%20at%203.24.34%20PM_Aditya%20Mehta.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p22",
    name: "Vishal Khanna S",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 0,
    tableTennis: 40,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-06-29%20at%203.44.07%20PM_Vishal%20Khanna%20S.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p23",
    name: "Bhavana Balachandran",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 70,
    football: 0,
    tableTennis: 40,
    skillRating: 50,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Bhavana%20Balachandran_Bhavana%20Balachandran.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p24",
    name: "Raveendra Bista",
    role: "",
    badminton: 95,
    carroms: 0,
    cricket: 95,
    football: 40,
    tableTennis: 70,
    skillRating: 60,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_20251006_223959_760_Raveendra%20Bista.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p25",
    name: "Anmol Narang",
    role: "",
    badminton: 0,
    carroms: 0,
    cricket: 0,
    football: 70,
    tableTennis: 0,
    skillRating: 14,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/DSC_0494_Anmol%20Narang.JPG",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p26",
    name: "Pavel Ray",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 0,
    skillRating: 32,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Screenshot%202026-06-29%20at%204.20.30%E2%80%AFPM_Pavel%20Ray.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p27",
    name: "Jayesh Jain",
    role: "",
    badminton: 40,
    carroms: 0,
    cricket: 95,
    football: 95,
    tableTennis: 0,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Image_Jayesh%20Jain.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p28",
    name: "Chintapalli Manikanta",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Photo_11zon_Manikanta%20Chintapall.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p29",
    name: "Glenvin Anil Rosario",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 70,
    football: 40,
    tableTennis: 40,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_3392_Glenvin%20Anil%20Rosario.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p30",
    name: "Shalini P",
    role: "",
    badminton: 95,
    carroms: 70,
    cricket: 40,
    football: 40,
    tableTennis: 70,
    skillRating: 63,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_7081%20Small_Shalini%20P.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p31",
    name: "Harshkumar Rajeshbhai Patel",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/images_Harshkumar%20Rajeshbha.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p32",
    name: "Navya Jaideep",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 40,
    football: 70,
    tableTennis: 40,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/MyPic_Navya%20Jaideep.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p33",
    name: "Sumit Kumar",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_6930_Sumit%20Kumar.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p34",
    name: "Ankit Ammanagi",
    role: "",
    badminton: 0,
    carroms: 0,
    cricket: 70,
    football: 70,
    tableTennis: 70,
    skillRating: 42,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Image_Ankit%20Ammanagi.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p35",
    name: "RAKSHA PRASAD M",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 70,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Profile_photo_Raksha%20Prasad.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p36",
    name: "Suraj Hiremath",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 70,
    skillRating: 64,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-06-30%20at%209.30.23%20AM_Suraj%20Hiremath.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p37",
    name: "Venkata Purandhar Chitteti",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 70,
    football: 40,
    tableTennis: 0,
    skillRating: 50,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/image_purandhar_Chitteti%20Venkata%20Pur.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p38",
    name: "Disha V",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 70,
    football: 40,
    tableTennis: 0,
    skillRating: 36,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_8322_Disha%20V.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p39",
    name: "Vishwanath Budugumpi",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 95,
    football: 40,
    tableTennis: 70,
    skillRating: 69,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-06-30%20at%2011.59.39_Vishwanath%20Budugumpi.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p40",
    name: "Kirti Dhanapune",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 0,
    tableTennis: 70,
    skillRating: 38,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/kirti_Kirti%20Dhanapune.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p41",
    name: "Sachin Gupta",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 95,
    football: 40,
    tableTennis: 70,
    skillRating: 69,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Screenshot%202026-06-30%20at%2012.21.06%E2%80%AFPM_Sachin%20Gupta.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p42",
    name: "Nandan R",
    role: "",
    badminton: 0,
    carroms: 40,
    cricket: 0,
    football: 0,
    tableTennis: 40,
    skillRating: 16,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Image_Nandan%20R.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p43",
    name: "Arko Mitra",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 70,
    tableTennis: 40,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Screenshot%202026-06-30%20at%2012.49.26%E2%80%AFPM_Arko%20Antony%20Mitra.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p44",
    name: "Arjun ghosh",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 0,
    football: 70,
    tableTennis: 70,
    skillRating: 42,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-06-30%20at%2012.50.53%20PM_Arjun%20Ghosh.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p45",
    name: "Aman Kalal",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 70,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/A4E2BBB3-36BE-416F-B021-2A19440E0266_Aman%20Kalal.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p46",
    name: "Neetha I J",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 0,
    football: 0,
    tableTennis: 0,
    skillRating: 14,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Neetha%20Pic_Neetha%20IJ.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p47",
    name: "Rahul Kiran",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 0,
    football: 0,
    tableTennis: 40,
    skillRating: 30,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Media_Rahul%20Kiran.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p48",
    name: "Prasanna Kumar R",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Prasanna_Prasanna%20Kumar%20R.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p49",
    name: "Vijay Anantpur",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 50,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_0490_Vijay%20Anantpur.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p50",
    name: "Viswajith K N",
    role: "",
    badminton: 0,
    carroms: 70,
    cricket: 70,
    football: 0,
    tableTennis: 0,
    skillRating: 28,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_7200_Viswajith%20K%20N.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p51",
    name: "Lakshya Ruhela",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 95,
    football: 70,
    tableTennis: 70,
    skillRating: 75,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/20241017_215226_Lakshya%20Ruhela.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p52",
    name: "Vinayak Bhandage",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 40,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG-20240611-WA0092~2_Vinayak%20Bhandage.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p53",
    name: "Madhu",
    role: "",
    badminton: 0,
    carroms: 70,
    cricket: 95,
    football: 70,
    tableTennis: 0,
    skillRating: 47,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Screenshot%202026-06-30%20at%203.38.09%E2%80%AFPM_Madhu.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p54",
    name: "Vishnu Mohan",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 0,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-06-30%20at%2015.45.46_Vishnu%20Mohan.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p55",
    name: "Pratyush Prakash",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 70,
    football: 40,
    tableTennis: 40,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/20250413_182047_Pratyush%20Prakash.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p56",
    name: "Tushar Tekta",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 95,
    football: 40,
    tableTennis: 70,
    skillRating: 63,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Media_Tushar%20Tekta.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p57",
    name: "Sushmitha M",
    role: "",
    badminton: 0,
    carroms: 0,
    cricket: 0,
    football: 0,
    tableTennis: 70,
    skillRating: 14,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/sush_Sushmitha%20M.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p58",
    name: "Rashmi Kadam",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 0,
    tableTennis: 0,
    skillRating: 24,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Rashmi%20Kadam_Rashmi%20Kadam.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p59",
    name: "Nisha Naik",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 0,
    football: 40,
    tableTennis: 70,
    skillRating: 50,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG20250227184011_Nisha%20Naik.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p60",
    name: "Iliyas Mulla",
    role: "",
    badminton: 40,
    carroms: 0,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 32,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/1000180576_Mulla%20Iliyas.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p61",
    name: "Riddhi Bastwadkar",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 0,
    football: 0,
    tableTennis: 0,
    skillRating: 22,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Image%20from%20iOS_Riddhi%20Bastwadkar.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p62",
    name: "Santosh Killamsetty",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 0,
    football: 70,
    tableTennis: 70,
    skillRating: 56,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-07-01%20at%2011.14.16_Santosh%20Killamsetty.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p63",
    name: "Koushik Bhattacharya",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/koushik_pic_Koushik%20Bhattacharya.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p64",
    name: "HIMANSU SEKHAR SAHOO",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 70,
    football: 70,
    tableTennis: 40,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/41213040_1616356501804259_2449291734329327616_Himansu%20Sekhar%20Sahoo.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p65",
    name: "Sri Sathwik",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 40,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/384dad53-0f31-4856-a205-5e052563fc7f_Sri%20Srinivasa%20Ganga.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p66",
    name: "Ujwal Manjunath",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 0,
    tableTennis: 70,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/T078JK1SS-UNVGC30JC-a7369e3b9dd0-512_Ujwal%20Manjunath.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p67",
    name: "Dharnendra L V",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 70,
    football: 70,
    tableTennis: 70,
    skillRating: 70,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_20211119_174854%20(1)_Dharnendra%20L%20V.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p68",
    name: "Nitish Kumar Kushwaha",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 0,
    football: 0,
    tableTennis: 0,
    skillRating: 22,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/DSC02628%20(1)_Nitish%20Kumar%20Kushwah.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p69",
    name: "Gokul Raja",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 40,
    football: 40,
    tableTennis: 70,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/20250816_123128_Gokul%20Raja%20TS.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p70",
    name: "Ganesh Sanjay Margale",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_0322_Ganesh%20Sanjay%20Margal.PNG",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p71",
    name: "Don Chakkappan",
    role: "",
    badminton: 0,
    carroms: 40,
    cricket: 70,
    football: 0,
    tableTennis: 0,
    skillRating: 22,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/don_Don%20Chakkappan.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p72",
    name: "Maddali Sudheer",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 95,
    football: 95,
    tableTennis: 70,
    skillRating: 74,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-07-02%20at%2012.14.18_Maddali%20Sudheer.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p73",
    name: "Kiran Bendekere",
    role: "",
    badminton: 0,
    carroms: 0,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 36,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/ABLR0606%20Kiran%20Bendekere_Kiran%20Bendekere.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p74",
    name: "So",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Sourav_image_Sourav%20Kumar.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p75",
    name: "Lohit V",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 40,
    football: 0,
    tableTennis: 0,
    skillRating: 30,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG20250926142852_Original_Lohit%20V.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p76",
    name: "Anupam Kumar",
    role: "",
    badminton: 95,
    carroms: 70,
    cricket: 95,
    football: 40,
    tableTennis: 70,
    skillRating: 74,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/20260501_171619_Anupam%20Kumar.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p77",
    name: "Varun HS",
    role: "",
    badminton: 0,
    carroms: 70,
    cricket: 40,
    football: 0,
    tableTennis: 70,
    skillRating: 36,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Image%20from%20iOS%20(1)_Varun%20HS.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p78",
    name: "Vipin U N",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 0,
    tableTennis: 40,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/76440_Vipin%20UN.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p79",
    name: "Hrishikesh S Raj",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 40,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG-20250507-WA0165_Hrishikesh%20Raj.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p80",
    name: "Udhay",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 58,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/file_00000000cc60720b9034931c59d290a8_Udhaya%20Kumar.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p81",
    name: "Yash Pendse",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 70,
    football: 40,
    tableTennis: 70,
    skillRating: 64,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/yash_pendse_photo_Yash%20Pendse.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p82",
    name: "Shubhi Goyal",
    role: "",
    badminton: 0,
    carroms: 40,
    cricket: 40,
    football: 0,
    tableTennis: 0,
    skillRating: 16,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_20260703_112054740~2_Shubhi%20Goyal.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p83",
    name: "Pratik G Desai",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_3746_Pratik%20Desai.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p84",
    name: "Vishant Singh",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 95,
    football: 95,
    tableTennis: 70,
    skillRating: 80,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Media%20(1)%20(1)_Vishant%20Singh.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p85",
    name: "Suraj Pakhare",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 40,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/20260621_131059_Suraj%20Pakhare.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p86",
    name: "D V Dileep",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 0,
    skillRating: 32,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/DSC_3907_D%20V%20Dileep.JPG",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p87",
    name: "Gutta Amarnath",
    role: "",
    badminton: 0,
    carroms: 0,
    cricket: 40,
    football: 0,
    tableTennis: 0,
    skillRating: 8,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/pic_Amarnath%20Gutta.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p88",
    name: "Vikram Gurubelli",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 0,
    football: 0,
    tableTennis: 40,
    skillRating: 24,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_20260703_153030_Gurubelli%20Vikram.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p89",
    name: "Revathi",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 0,
    football: 0,
    tableTennis: 40,
    skillRating: 24,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_9618_Revathi%20Mallikarjun.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p90",
    name: "Rajesh Vavilala",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 95,
    football: 40,
    tableTennis: 0,
    skillRating: 55,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Screenshot_2026_0703_155950_Rajesh%20Vavilala.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p91",
    name: "Chennam Yuvaraju",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 40,
    football: 0,
    tableTennis: 0,
    skillRating: 22,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/ABLR0491_Chennam%20Yuvaraju.JPG",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p92",
    name: "K C Santosh",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 0,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p93",
    name: "Siddarth S Desai",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG-20230515-WA0002~2_Siddarth%20Desai.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p94",
    name: "Mahesh Nironi",
    role: "",
    badminton: 40,
    carroms: 95,
    cricket: 70,
    football: 0,
    tableTennis: 0,
    skillRating: 41,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/mahesh_Mahesh%20Nironi.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p95",
    name: "Manshu Saingar",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 70,
    football: 40,
    tableTennis: 0,
    skillRating: 50,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Image%20from%20iOS_Manshu%20Saingar.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p96",
    name: "Abhisek Mallick",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 40,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p97",
    name: "Maqsood Desai",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 70,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/my-passport-photo_Maqsood%20Desai.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p98",
    name: "Ayushi Kushwaha",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p99",
    name: "Thoshima Kaveramma B S",
    role: "",
    badminton: 0,
    carroms: 70,
    cricket: 0,
    football: 70,
    tableTennis: 0,
    skillRating: 28,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Thoshima_Thoshima%20Kaveramma.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p100",
    name: "Shruti L Gataraddihal",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 0,
    tableTennis: 0,
    skillRating: 24,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p101",
    name: "Praveen G Kalmath",
    role: "",
    badminton: 0,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 0,
    skillRating: 36,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Praveen%20G%20Kalmath_Praveen%20G%20Kalmath.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p102",
    name: "Ashish Kaushal",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 0,
    football: 40,
    tableTennis: 0,
    skillRating: 24,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/68995cfa-91f6-436f-904a-6553d9972b8a~1_Ashish%20Kaushal.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p103",
    name: "Jagadishwari S",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p104",
    name: "Govind S",
    role: "",
    badminton: 40,
    carroms: 0,
    cricket: 0,
    football: 70,
    tableTennis: 0,
    skillRating: 22,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/1572330914192_Govind%20S.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p105",
    name: "Vishnu K P",
    role: "",
    badminton: 70,
    carroms: 70,
    cricket: 0,
    football: 70,
    tableTennis: 70,
    skillRating: 56,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p106",
    name: "Peethani RaviRaja",
    role: "",
    badminton: 95,
    carroms: 70,
    cricket: 95,
    football: 70,
    tableTennis: 70,
    skillRating: 80,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p107",
    name: "Shaik Rahul",
    role: "",
    badminton: 0,
    carroms: 40,
    cricket: 95,
    football: 0,
    tableTennis: 0,
    skillRating: 27,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/tempImagezcSQmV_Shaik%20Rahul.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p108",
    name: "Kalp Agarwal",
    role: "",
    badminton: 40,
    carroms: 0,
    cricket: 0,
    football: 0,
    tableTennis: 0,
    skillRating: 8,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p109",
    name: "aryan choudhary",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 40,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p110",
    name: "ANMOL RAJPUT",
    role: "",
    badminton: 70,
    carroms: 0,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 38,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-04-11%20at%2010.44.46%20AM%20(2)_Anmol%20Rajput.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p111",
    name: "Souvik Biswas",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 70,
    football: 70,
    tableTennis: 0,
    skillRating: 44,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/WhatsApp%20Image%202026-07-07%20at%2013.02.37_Souvik%20Biswas.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p112",
    name: "Bharath S",
    role: "",
    badminton: 40,
    carroms: 0,
    cricket: 0,
    football: 0,
    tableTennis: 40,
    skillRating: 16,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/new%20pic_Bharath%20S.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p113",
    name: "Agatya Panigrahy",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 0,
    football: 0,
    tableTennis: 40,
    skillRating: 24,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Screenshot%202026-06-05%20at%202.16.22%E2%80%AFPM_Agatya%20Panigrahy.png",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p114",
    name: "Rohith H",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 40,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/photo_Rohith%20H.jpg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p115",
    name: "Rupali Gangarde",
    role: "",
    badminton: 40,
    carroms: 40,
    cricket: 40,
    football: 0,
    tableTennis: 40,
    skillRating: 32,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p116",
    name: "Kumuda Naik",
    role: "",
    badminton: 70,
    carroms: 40,
    cricket: 40,
    football: 0,
    tableTennis: 40,
    skillRating: 38,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/IMG_8665_Kumuda%20Naik.jpeg",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p117",
    name: "mahesh",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 70,
    football: 0,
    tableTennis: 0,
    skillRating: 36,
    falaLeague: "No",
    photoUrl: "https://falabella-my.sharepoint.com/personal/kumuda_bopaiah_falabella_cl1/Documents/Aplicaciones/Microsoft%20Forms/Register%20for%20participating%20in%20Falaliga%2040/Question/Mahesh%20Chinchure_Mahesh%20Chinchure.JPG",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p118",
    name: "Himanshu Jaiswal",
    role: "",
    badminton: 40,
    carroms: 70,
    cricket: 40,
    football: 70,
    tableTennis: 40,
    skillRating: 52,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  },
  {
    id: "p119",
    name: "Vikhyath BM",
    role: "",
    badminton: 95,
    carroms: 0,
    cricket: 95,
    football: 0,
    tableTennis: 40,
    skillRating: 46,
    falaLeague: "No",
    photoUrl: "",
    isSold: false,
    soldTo: null,
    soldAmount: null,
    isUnsold: false,
    isOwnerOrCoOwner: false
  }
];
var INITIAL_TEAMS = [
  { id: "t1", name: "Elite Eagle", owner: null, coOwner: null, budget: 1e6, color: "#ef4444" },
  { id: "t2", name: "Ordervengers", owner: null, coOwner: null, budget: 1e6, color: "#3b82f6" },
  { id: "t3", name: "The Load Balancers", owner: null, coOwner: null, budget: 1e6, color: "#10b981" },
  { id: "t4", name: "The Groundbreakers", owner: null, coOwner: null, budget: 1e6, color: "#f59e0b" },
  { id: "t5", name: "Synergy Slayers", owner: null, coOwner: null, budget: 1e6, color: "#8b5cf6" },
  { id: "t6", name: "Falcon Fury", owner: null, coOwner: null, budget: 1e6, color: "#ec4899" },
  { id: "t7", name: "Ctl Alt Defeat", owner: null, coOwner: null, budget: 1e6, color: "#06b6d4" },
  { id: "t8", name: "EKAM", owner: null, coOwner: null, budget: 1e6, color: "#14b8a6" }
];

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
var DATA_FILE = import_path.default.join(process.cwd(), "data.json");
var PLAYERS_DIR = import_path.default.join(process.cwd(), "public", "players");
if (!import_fs.default.existsSync(PLAYERS_DIR)) {
  import_fs.default.mkdirSync(PLAYERS_DIR, { recursive: true });
}
function getState() {
  if (!import_fs.default.existsSync(DATA_FILE)) {
    const defaultData = {
      players: INITIAL_PLAYERS,
      teams: INITIAL_TEAMS,
      state: {
        currentPlayerId: null,
        currentBid: 0,
        currentBidderId: null,
        status: "idle",
        isAutoBidding: false,
        lastBidTime: 0,
        soldPlayerId: null,
        soldToTeamId: null,
        soldAmount: null,
        animationEndsAt: null
      }
    };
    import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
  try {
    const content = import_fs.default.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading data file, resetting to defaults...", error);
    const defaultData = {
      players: INITIAL_PLAYERS,
      teams: INITIAL_TEAMS,
      state: {
        currentPlayerId: null,
        currentBid: 0,
        currentBidderId: null,
        status: "idle",
        isAutoBidding: false,
        lastBidTime: 0,
        soldPlayerId: null,
        soldToTeamId: null,
        soldAmount: null,
        animationEndsAt: null
      }
    };
    import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
}
function saveState(data) {
  import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}
app.use(import_express.default.json({ limit: "20mb" }));
app.get("/api/state", (req, res) => {
  const data = getState();
  if (data.state.animationEndsAt && Date.now() > data.state.animationEndsAt && (data.state.status === "sold" || data.state.status === "unsold")) {
    if (data.state.isAutoPilotActive) {
      const availablePlayers = data.players.filter(
        (p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner
      );
      if (availablePlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePlayers.length);
        const selectedPlayer = availablePlayers[randomIndex];
        data.state.currentPlayerId = selectedPlayer.id;
        data.state.currentBid = 0;
        data.state.currentBidderId = null;
        data.state.status = "bidding";
        data.state.isAutoBidding = false;
        data.state.lastBidTime = Date.now();
        data.state.soldPlayerId = null;
        data.state.soldToTeamId = null;
        data.state.soldAmount = null;
        data.state.animationEndsAt = null;
        data.state.shufflingEndsAt = Date.now() + 3e3;
      } else {
        data.state.status = "idle";
        data.state.currentPlayerId = null;
        data.state.currentBid = 0;
        data.state.currentBidderId = null;
        data.state.soldPlayerId = null;
        data.state.soldToTeamId = null;
        data.state.soldAmount = null;
        data.state.animationEndsAt = null;
        data.state.isAutoPilotActive = false;
      }
    } else {
      data.state.status = "idle";
      data.state.currentPlayerId = null;
      data.state.currentBid = 0;
      data.state.currentBidderId = null;
      data.state.soldPlayerId = null;
      data.state.soldToTeamId = null;
      data.state.soldAmount = null;
      data.state.animationEndsAt = null;
    }
    saveState(data);
  }
  res.json(data);
});
app.post("/api/state/reset", (req, res) => {
  const defaultData = {
    players: INITIAL_PLAYERS,
    teams: INITIAL_TEAMS,
    state: {
      currentPlayerId: null,
      currentBid: 0,
      currentBidderId: null,
      status: "idle",
      isAutoBidding: false,
      lastBidTime: 0,
      soldPlayerId: null,
      soldToTeamId: null,
      soldAmount: null,
      animationEndsAt: null
    }
  };
  saveState(defaultData);
  res.json({ message: "State reset successfully", data: defaultData });
});
app.post("/api/state/import", (req, res) => {
  const data = req.body;
  if (!data.players || !data.teams || !data.state) {
    res.status(400).json({ error: "Invalid auction data format" });
    return;
  }
  saveState(data);
  res.json({ message: "Imported state successfully", data });
});
app.post("/api/teams", (req, res) => {
  const data = getState();
  const { action, team } = req.body;
  if (action === "create") {
    const newTeam = {
      id: "t_" + Date.now(),
      name: team.name || "New Team",
      owner: team.owner || null,
      coOwner: team.coOwner || null,
      budget: Number(team.budget) ?? 1e6,
      color: team.color || "#3b82f6"
    };
    data.teams.push(newTeam);
    saveState(data);
    res.json({ message: "Team created successfully", team: newTeam });
  } else if (action === "update") {
    const index = data.teams.findIndex((t) => t.id === team.id);
    if (index !== -1) {
      const oldTeam = data.teams[index];
      data.teams[index] = {
        ...data.teams[index],
        name: team.name,
        owner: team.owner || null,
        coOwner: team.coOwner || null,
        budget: Number(team.budget) ?? 1e6,
        color: team.color
      };
      data.players.forEach((p) => {
        p.isOwnerOrCoOwner = false;
      });
      data.teams.forEach((t) => {
        if (t.owner) {
          const ownerPlayer = data.players.find((p) => p.name.toLowerCase() === t.owner?.toLowerCase());
          if (ownerPlayer) ownerPlayer.isOwnerOrCoOwner = true;
        }
        if (t.coOwner) {
          const coOwnerPlayer = data.players.find((p) => p.name.toLowerCase() === t.coOwner?.toLowerCase());
          if (coOwnerPlayer) coOwnerPlayer.isOwnerOrCoOwner = true;
        }
      });
      saveState(data);
      res.json({ message: "Team updated successfully", team: data.teams[index] });
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } else if (action === "delete") {
    const index = data.teams.findIndex((t) => t.id === team.id);
    if (index !== -1) {
      const deletedTeam = data.teams.splice(index, 1)[0];
      data.players.forEach((p) => {
        p.isOwnerOrCoOwner = false;
      });
      data.teams.forEach((t) => {
        if (t.owner) {
          const ownerPlayer = data.players.find((p) => p.name.toLowerCase() === t.owner?.toLowerCase());
          if (ownerPlayer) ownerPlayer.isOwnerOrCoOwner = true;
        }
        if (t.coOwner) {
          const coOwnerPlayer = data.players.find((p) => p.name.toLowerCase() === t.coOwner?.toLowerCase());
          if (coOwnerPlayer) coOwnerPlayer.isOwnerOrCoOwner = true;
        }
      });
      saveState(data);
      res.json({ message: "Team deleted successfully", team: deletedTeam });
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } else {
    res.status(400).json({ error: "Invalid team action" });
  }
});
app.post("/api/players", (req, res) => {
  const data = getState();
  const { action, player, playersList } = req.body;
  if (action === "create") {
    const newPlayer = {
      id: "p_" + Date.now(),
      name: player.name || "Unnamed Player",
      role: player.role || "",
      badminton: Number(player.badminton) || 0,
      carroms: Number(player.carroms) || 0,
      cricket: Number(player.cricket) || 0,
      football: Number(player.football) || 0,
      tableTennis: Number(player.tableTennis) || 0,
      skillRating: Number(player.skillRating) || 0,
      falaLeague: player.falaLeague || "No",
      photoUrl: player.photoUrl || "",
      isSold: false,
      soldTo: null,
      soldAmount: null,
      isUnsold: false,
      isOwnerOrCoOwner: false
    };
    data.players.push(newPlayer);
    saveState(data);
    res.json({ message: "Player created successfully", player: newPlayer });
  } else if (action === "update") {
    const index = data.players.findIndex((p) => p.id === player.id);
    if (index !== -1) {
      const oldPlayer = data.players[index];
      if (oldPlayer.isSold && oldPlayer.soldTo && oldPlayer.soldAmount !== null) {
        const oldTeam = data.teams.find((t) => t.id === oldPlayer.soldTo);
        if (oldTeam) {
          oldTeam.budget += Number(oldPlayer.soldAmount);
        }
      }
      const isSold = player.isSold ?? oldPlayer.isSold;
      const soldTo = player.soldTo || null;
      const soldAmount = player.soldAmount !== null && player.soldAmount !== void 0 ? Number(player.soldAmount) : null;
      const isUnsold = player.isUnsold ?? oldPlayer.isUnsold;
      if (isSold && soldTo && soldAmount !== null) {
        const newTeam = data.teams.find((t) => t.id === soldTo);
        if (newTeam) {
          newTeam.budget -= soldAmount;
        }
      }
      data.players[index] = {
        ...data.players[index],
        name: player.name,
        role: player.role || "",
        badminton: Number(player.badminton) || 0,
        carroms: Number(player.carroms) || 0,
        cricket: Number(player.cricket) || 0,
        football: Number(player.football) || 0,
        tableTennis: Number(player.tableTennis) || 0,
        skillRating: Number(player.skillRating) || 0,
        falaLeague: player.falaLeague || "No",
        photoUrl: player.photoUrl || "",
        isSold,
        soldTo,
        soldAmount,
        isUnsold
      };
      saveState(data);
      res.json({ message: "Player updated successfully", player: data.players[index] });
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } else if (action === "delete") {
    const index = data.players.findIndex((p) => p.id === player.id);
    if (index !== -1) {
      const deletedPlayer = data.players.splice(index, 1)[0];
      saveState(data);
      res.json({ message: "Player deleted successfully", player: deletedPlayer });
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } else if (action === "bulk") {
    if (!Array.isArray(playersList)) {
      res.status(400).json({ error: "playersList must be an array" });
      return;
    }
    const uploadedPlayers = playersList.map((p, idx) => ({
      id: `p_bulk_${Date.now()}_${idx}`,
      name: p.name || `Player ${idx}`,
      role: p.role || "",
      badminton: Number(p.badminton) || 0,
      carroms: Number(p.carroms) || 0,
      cricket: Number(p.cricket) || 0,
      football: Number(p.football) || 0,
      tableTennis: Number(p.tableTennis) || 0,
      skillRating: Number(p.skillRating) || 0,
      falaLeague: p.falaLeague || "No",
      photoUrl: p.photoUrl || "",
      isSold: false,
      soldTo: null,
      soldAmount: null,
      isUnsold: false,
      isOwnerOrCoOwner: false
    }));
    data.players = [...data.players, ...uploadedPlayers];
    saveState(data);
    res.json({ message: "Bulk upload successful", count: uploadedPlayers.length });
  } else {
    res.status(400).json({ error: "Invalid player action" });
  }
});
app.post("/api/players/match-photos", (req, res) => {
  const data = getState();
  let matchedCount = 0;
  try {
    if (!import_fs.default.existsSync(PLAYERS_DIR)) {
      res.json({ message: "Local players photo directory empty", matchedCount: 0 });
      return;
    }
    const files = import_fs.default.readdirSync(PLAYERS_DIR);
    data.players.forEach((player) => {
      const normalizedPlayerName = player.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchedFile = files.find((file) => {
        const ext = import_path.default.extname(file);
        const nameWithoutExt = import_path.default.basename(file, ext).toLowerCase().replace(/[^a-z0-9]/g, "");
        return nameWithoutExt === normalizedPlayerName || nameWithoutExt.includes(normalizedPlayerName) || normalizedPlayerName.includes(nameWithoutExt);
      });
      if (matchedFile) {
        player.photoUrl = `/players/${matchedFile}`;
        matchedCount++;
      }
    });
    saveState(data);
    res.json({ message: "Local photos auto-merged successfully", matchedCount });
  } catch (error) {
    console.error("Error matching local photos", error);
    res.status(500).json({ error: "Error scanning local photo directory" });
  }
});
app.post("/api/auction/select", (req, res) => {
  const data = getState();
  const { playerId } = req.body;
  const player = data.players.find((p) => p.id === playerId);
  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }
  data.state.currentPlayerId = playerId;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;
  data.state.status = "bidding";
  data.state.isAutoBidding = false;
  data.state.lastBidTime = Date.now();
  data.state.soldPlayerId = null;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = null;
  data.state.shufflingEndsAt = null;
  data.state.isAutoPilotActive = false;
  saveState(data);
  res.json({ message: "Player selected for bidding", state: data.state });
});
app.post("/api/auction/auto-select", (req, res) => {
  const data = getState();
  const availablePlayers = data.players.filter(
    (p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner
  );
  if (availablePlayers.length === 0) {
    res.status(400).json({ error: "No available players remaining in the draft pool" });
    return;
  }
  const randomIndex = Math.floor(Math.random() * availablePlayers.length);
  const selectedPlayer = availablePlayers[randomIndex];
  data.state.currentPlayerId = selectedPlayer.id;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;
  data.state.status = "bidding";
  data.state.isAutoBidding = false;
  data.state.lastBidTime = Date.now();
  data.state.soldPlayerId = null;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = null;
  data.state.shufflingEndsAt = Date.now() + 3e3;
  data.state.isAutoPilotActive = true;
  saveState(data);
  res.json({ message: "Auto-selected player for nomination", state: data.state });
});
app.post("/api/auction/toggle-autopilot", (req, res) => {
  const data = getState();
  data.state.isAutoPilotActive = !data.state.isAutoPilotActive;
  saveState(data);
  res.json({ message: `Auto-pilot status updated`, state: data.state });
});
app.post("/api/auction/bid", (req, res) => {
  const data = getState();
  const { teamId, amount } = req.body;
  if (data.state.status !== "bidding") {
    res.status(400).json({ error: "No active bidding on block" });
    return;
  }
  const team = data.teams.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ error: "Team not found" });
    return;
  }
  if (team.budget < amount) {
    res.status(400).json({ error: "Insufficient budget for this team" });
    return;
  }
  if (amount <= data.state.currentBid && data.state.currentBid > 0) {
    res.status(400).json({ error: "Bid must be higher than current bid" });
    return;
  }
  data.state.currentBid = amount;
  data.state.currentBidderId = teamId;
  data.state.lastBidTime = Date.now();
  saveState(data);
  res.json({ message: "Bid accepted", state: data.state });
});
app.post("/api/auction/sold", (req, res) => {
  const data = getState();
  if (data.state.status !== "bidding" || !data.state.currentPlayerId) {
    res.status(400).json({ error: "No active player bidding to complete" });
    return;
  }
  const player = data.players.find((p) => p.id === data.state.currentPlayerId);
  if (!player) {
    res.status(404).json({ error: "Current player not found" });
    return;
  }
  const { teamId: manualTeamId, amount: manualAmount } = req.body;
  const teamId = manualTeamId !== void 0 ? manualTeamId : data.state.currentBidderId;
  const finalBid = manualAmount !== void 0 ? Number(manualAmount) : data.state.currentBid;
  if (!teamId) {
    player.isUnsold = true;
    data.state.status = "unsold";
    data.state.soldPlayerId = player.id;
    data.state.soldToTeamId = null;
    data.state.soldAmount = null;
    data.state.animationEndsAt = Date.now() + 6e3;
    data.state.currentPlayerId = null;
    data.state.currentBid = 0;
    data.state.currentBidderId = null;
    saveState(data);
    res.json({ message: "Player marked as unsold due to zero bids", state: data.state });
    return;
  }
  const team = data.teams.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ error: "Bidding team not found" });
    return;
  }
  if (team.budget < finalBid) {
    res.status(400).json({ error: "Winning team has insufficient budget" });
    return;
  }
  team.budget -= finalBid;
  player.isSold = true;
  player.soldTo = teamId;
  player.soldAmount = finalBid;
  data.state.status = "sold";
  data.state.soldPlayerId = player.id;
  data.state.soldToTeamId = teamId;
  data.state.soldAmount = finalBid;
  data.state.animationEndsAt = Date.now() + 6e3;
  saveState(data);
  res.json({ message: "Player SOLD!", state: data.state });
});
app.post("/api/auction/unsold", (req, res) => {
  const data = getState();
  if (data.state.status !== "bidding" || !data.state.currentPlayerId) {
    res.status(400).json({ error: "No active player bidding to mark unsold" });
    return;
  }
  const player = data.players.find((p) => p.id === data.state.currentPlayerId);
  if (!player) {
    res.status(404).json({ error: "Current player not found" });
    return;
  }
  player.isUnsold = true;
  data.state.status = "unsold";
  data.state.soldPlayerId = player.id;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = Date.now() + 6e3;
  data.state.currentPlayerId = null;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;
  saveState(data);
  res.json({ message: "Player marked as UNSOLD", state: data.state });
});
app.post("/api/auction/skip", (req, res) => {
  const data = getState();
  const skippedPlayerId = data.state.currentPlayerId;
  if (skippedPlayerId) {
    const index = data.players.findIndex((p) => p.id === skippedPlayerId);
    if (index !== -1) {
      const [skippedPlayer] = data.players.splice(index, 1);
      skippedPlayer.isSold = false;
      skippedPlayer.soldTo = null;
      skippedPlayer.soldAmount = null;
      skippedPlayer.isUnsold = false;
      data.players.push(skippedPlayer);
    }
  }
  data.state.currentPlayerId = null;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;
  data.state.status = "idle";
  data.state.isAutoBidding = false;
  data.state.soldPlayerId = null;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = null;
  saveState(data);
  res.json({ message: "Player skipped to the end of the queue", state: data.state });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Falaliga Auction 4.0 server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
