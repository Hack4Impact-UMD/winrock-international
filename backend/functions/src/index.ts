import * as e from "express";
import { onRequest } from "firebase-functions/v2/https";

import * as formAPI from "./formAPI.js";

import RenewableProjectProposal from "./forms/RenewableProjectProposal.js";
// import other forms...

const createRenewableProjectProposal = onRequest(async (request: e.Request, response: e.Response) => {
    formAPI.createFormSubmission<RenewableProjectProposal>(request, response, RenewableProjectProposal.formType);
});

const getRenewableProjectProposal = onRequest(async (request: e.Request, response: e.Response) => {
    formAPI.getFormSubmission(request, response, RenewableProjectProposal.formType);
});

const getAllRenewableProjectProposals = onRequest(async (request: e.Request, response: e.Response) => {
    formAPI.getAllFormSubmissions(request, response, RenewableProjectProposal.formType);
});

const deleteRenewableProjectProposal = onRequest(async (request: e.Request, response: e.Response) => {
    formAPI.deleteFormSubmission(request, response, RenewableProjectProposal.formType);
});

// continue for other form types...

export { createRenewableProjectProposal, getRenewableProjectProposal, getAllRenewableProjectProposals, deleteRenewableProjectProposal };