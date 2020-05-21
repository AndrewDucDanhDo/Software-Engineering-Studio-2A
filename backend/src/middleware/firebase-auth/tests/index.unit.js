import { expect } from "chai";
import httpMocks from "node-mocks-http";
import sinon from "sinon";
import { checkToken, checkUser, checkTeacher } from "../index";
import { login } from "../../../controllers/auth";


describe("Middle Firebase Auth", () => {
    it("Should check token", async function () {
        // Allow more time for firebase requests
        this.timeout(10000);

        // Setup mocks
        const mockReq = httpMocks.createRequest({
            body: {
                email: "middleware@unit.test",
                password: "password"
            }
        });
        const mockRes = httpMocks.createResponse();

        // Login to get idToken
        await login(mockReq, mockRes);

        // Assert was able to get token
        expect(mockRes._getStatusCode()).to.equal(200);

        // Add token to header
        mockReq.headers.authorization = "Bearer " + mockRes._getJSONData().data.idToken;
        const userId = mockRes._getJSONData().data.userId;

        // Call function
        checkToken(mockReq, mockRes, function () {
            // Assert
            expect(mockReq.authId).to.equal(userId);
        });
    });

    it("Should check user", function (done) {
        // Setup mocks
        const next = sinon.fake();
        const mockReq = httpMocks.createRequest({
            authId: "authId",
            params: {
                userId: "authId"
            }
        });
        const mockRes = httpMocks.createResponse();

        // Call function
        checkUser(mockReq, mockRes, next);

        // Assert
        expect(next.called).to.equal(true);
        done();
    });


    it("Should check not user", function (done) {
        // Setup mocks
        const next = sinon.fake();
        const mockReq = httpMocks.createRequest({
            authId: "authId",
            params: {
                userId: null
            }
        });
        const mockRes = httpMocks.createResponse();

        // Call function
        checkUser(mockReq, mockRes, next);

        // Assert
        expect(next.called).to.equal(false);
        done();
    });

    it("Should check if not teacher", () => {
        // Setup mocks
        const next = sinon.fake();
        const mockReq = httpMocks.createRequest({
            userClaims: {
                teacher: false
            }
        });
        const mockRes = httpMocks.createResponse();

        // Call function
        checkTeacher(mockReq, mockRes, next);

        // Assert
        expect(next.called).to.equal(false);
    });

    it("Should check if teacher", () => {
        // Setup mocks
        const next = sinon.fake();
        const mockReq = httpMocks.createRequest({
            userClaims: {
                teacher: true
            }
        });
        const mockRes = httpMocks.createResponse();

        // Call function
        checkTeacher(mockReq, mockRes, next);

        // Assert
        expect(next.called).to.equal(true);
    });
});
