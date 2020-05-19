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
    it("Should create a user", function (done) {
        this.timeout(10000);

        // Setup mocks
        const mockReq = httpMocks.createRequest({
            body: body
        });
        const mockRes = httpMocks.createResponse();

        // call function
        createUser(mockReq, mockRes).then(() => {

            // assert response
            var { data } = mockRes._getJSONData();
            expect(data.email).to.equal(body.email);
            expect(data.displayName).to.equal(body.displayName);
            expect(mockRes._getStatusCode()).to.equal(200);

            uid = data.uid;
            done();
        });
    });

    it("Should get a user", function (done) {
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
        getUser(mockReq, mockRes).then(() => {

            // assert response
            var { data } = mockRes._getJSONData();
            expect(data.email).to.equal(body.email);
            expect(data.displayName).to.equal(body.displayName);
            expect(mockRes._getStatusCode()).to.equal(200);
            done();
        });
    });

    it("Should update a user", function (done) {
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
        updateUser(mockReq, mockRes).then(() => {

            // assert response
            var { data } = mockRes._getJSONData();
            expect(data.email).to.equal(updateUserBody.email);
            expect(data.displayName).to.equal(updateUserBody.displayName);
            expect(mockRes._getStatusCode()).to.equal(200);
            done();
        });
    });

    it("Should delete a user", function (done) {
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
        deleteUser(mockReq, mockRes).then(() => {

            // assert response
            expect(mockRes._getStatusCode()).to.equal(200);

            // assert user was deleted and no longer exists
            getUser(mockReq, mockRes).then(() => {
                expect(mockRes._getStatusCode()).to.equal(500);
                done();
            });
        });
    });
});
