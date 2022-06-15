/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      /**********[Ajout de tests unitaires et d'intégration] **********/
      //to-do write expect expression
      expect(windowIcon.className).toBe("active-icon");
    });
    /***************************** [Bug report] - Bills ***********************************/
    // To ensure that the test is passed, the bills list has been sorted in BilssUI.
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    test("Then we we click on 'eye' icon it should display the file in a modal", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      // we are connected as employee
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      // we initiate the Bills UI and test the event onClick the eay icon
      document.body.innerHTML = BillsUI({ data: bills });
      new Bills({ document, onNavigate, localStorage: window.localStorage });
      // we mocke the the jQuery modal plugin to simulate the function
      jQuery.fn.modal = jest.fn();
      const eyeIcon = screen.getAllByTestId("icon-eye")[0];
      userEvent.click(eyeIcon);
      expect(jQuery.fn.modal).toHaveBeenCalledWith("show");
    });
    // new bill btn test
    test("Then when we click on new bill button we should navigate to new bill page", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      new Bills({ document, onNavigate, localStorage: window.localStorage });
      const newBillBtn = screen.getByTestId("btn-new-bill");
      userEvent.click(newBillBtn);
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy;
      expect(screen.queryByTestId("form-new-bill")).toBeTruthy();
    });
  });
});
describe("fetching data form api", () => {
  it("should retrieve bills ", async () => {
    // we initiate a new bills
    const bills = new Bills({
      store: mockStore,
      document,
    });
    expect(await bills.getBills()).toHaveLength(4);
  });
  it("should retrieve bills ", async () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    // we initiate a new bills
    const bills = new Bills({
      store: null,
      document,
    });
    expect(await bills.getBills()).toBe(undefined);
  });
});

// integration test

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    it("should retrieve all the bills", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      // we connected as employees
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.location = "/#employee/bills";
      await router();
      const tbody = waitFor(() => screen.getByTestId("tbody"));
      expect(tbody).toBeTruthy();
    });
    describe("when we can't retrieve bills", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "test@error",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
      });

      test("When we fetch Bills we will expect 404 error message ", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });
      test("When we fetch Bills we will expect 404 error message", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
