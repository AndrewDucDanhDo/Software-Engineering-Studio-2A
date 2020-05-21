import { expect } from "chai";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import { createUser, getUser, updateUser, deleteUser } from "../user";

describe("User Management", () => {
    var uid = null;
    const body = {
        email: "test1234@test.com",
        password: "password",
        displayName: "Test"
    }
    it("Should create a user", async function () {
        this.timeout(10000);

        // Setup mocks
        const mockReq = httpMocks.createRequest({
            body: body
        });
        const mockRes = httpMocks.createResponse();

        // call function
        await createUser(mockReq, mockRes);

        // assert response
        const { data } = mockRes._getJSONData();
        expect(data.email).to.equal(body.email);
        expect(data.displayName).to.equal(body.displayName);
        expect(mockRes._getStatusCode()).to.equal(200);

        uid = data.uid;
    });

    it("Should get a user", async function () {
        this.timeout(10000);

        // Setup mocks
        const params = {
            userId: uid
        }
        const mockReq = httpMocks.createRequest({
            params: params
        });
        const mockRes = httpMocks.createResponse();

        // call function
        await getUser(mockReq, mockRes);

        // assert response
        var { data } = mockRes._getJSONData();
        expect(data.email).to.equal(body.email);
        expect(data.displayName).to.equal(body.displayName);
        expect(mockRes._getStatusCode()).to.equal(200);
    });

    it("Should update a user", async function () {
        this.timeout(10000);

        // Setup mocks
        const updateUserBody = {
            email: "test12345@test.com",
            password: "password2",
            displayName: "Updated Test"
        }
        const params = {
            userId: uid
        }
        const mockReq = httpMocks.createRequest({
            params: params,
            body: updateUserBody
        });
        const mockRes = httpMocks.createResponse();

        // call function
        await updateUser(mockReq, mockRes);

        // assert response
        var { data } = mockRes._getJSONData();
        expect(data.email).to.equal(updateUserBody.email);
        expect(data.displayName).to.equal(updateUserBody.displayName);
        expect(mockRes._getStatusCode()).to.equal(200);

    });

    it("Should delete a user", async function () {
        this.timeout(10000);

        // Setup mocks
        const params = {
            userId: uid
        }
        const mockReq = httpMocks.createRequest({
            params: params
        });

        const mockRes = httpMocks.createResponse();

        // call function
        await deleteUser(mockReq, mockRes);

        // assert response
        expect(mockRes._getStatusCode()).to.equal(200);

        // assert user was deleted and no longer exists
        await getUser(mockReq, mockRes);
        expect(mockRes._getStatusCode()).to.equal(500);
    });
});
