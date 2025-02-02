/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  screen,
  getByTestId,
  getByLabelText,
} from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store";
import router from "../app/Router";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import NewBill, {
  INVALID_EXTENSION_MESSAGE,
  INVALID_FORM_BAD_FILE,
} from "../containers/NewBill";
import NewBillUI from "../views/NewBillUI";
import store from "../app/store";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    //
    test("then the mail icon in vertical layout should be highlighted", () => {
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Setup the router.
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();

      // Go to the NewBill page.
      window.onNavigate(ROUTES_PATH.NewBill);

      const windowIcon = screen.getByTestId("icon-mail");
      expect(windowIcon).toHaveClass("active-icon");
    });
    // test("upload file to create a new bill with a correct type", () => {
    //   const image = "image.png";
    //   window.localStorage.setItem(
    //     "user",
    //     JSON.stringify({
    //       type: "Employee",
    //     })
    //   );

    //   // Setup the router.
    //   const root = document.createElement("div");
    //   root.setAttribute("id", "root");
    //   document.body.append(root);
    //   router();

    //   // Go to the NewBill page.
    //   window.onNavigate(ROUTES_PATH.NewBill);

    //   // fill up the form
    //   fireEvent.change(screen.getByTestId("expense-type"), "Hôtel et logement");
    //   fireEvent.change(screen.getByTestId("expense-name"), "Hotel");
    //   fireEvent.change(screen.getByTestId("datepicker"), "2022-04-05");
    //   fireEvent.change(screen.getByTestId("amount"), "400");
    //   fireEvent.change(screen.getByTestId("vat"), "20");
    //   fireEvent.change(screen.getByTestId("pct"), "20");
    //   fireEvent.change(screen.getByTestId("file"), image);
    //   // eventr on click to submit the form
    //   userEvent.click(screen.getByText("Envoyer"));

    //   expect(window.location.hash).toBe("#employee/bills");
    // });
    // test("upload file to create a new bill with a correct type", () => {
    //   const image = "image.pdf";
    //   window.localStorage.setItem(
    //     "user",
    //     JSON.stringify({
    //       type: "Employee",
    //     })
    //   );

    //   // Setup the router.
    //   const root = document.createElement("div");
    //   root.setAttribute("id", "root");
    //   document.body.append(root);
    //   router();

    //   // Go to the NewBill page.
    //   window.onNavigate(ROUTES_PATH.NewBill);

    //   // fill up the form
    //   fireEvent.change(screen.getByTestId("expense-type"), "Hôtel et logement");
    //   fireEvent.change(screen.getByTestId("expense-name"), "Hotel");
    //   fireEvent.change(screen.getByTestId("datepicker"), "2022-04-05");
    //   fireEvent.change(screen.getByTestId("amount"), "400");
    //   fireEvent.change(screen.getByTestId("vat"), "20");
    //   fireEvent.change(screen.getByTestId("pct"), "20");
    //   fireEvent.change(screen.getByTestId("file"), image);
    //   // eventr on click to submit the form
    //   userEvent.click(screen.getByText("Envoyer"));
    //   const error = screen.queryByTestId("errorMessage");
    //   expect(window.location.hash).toBe("#employee/bills");
    // });

    // integration test
    it(" Should display an error message when the file extension is not correct", () => {
      // Pretend that we're connected as an employee.
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@company.test",
        })
      );
      window.onNavigate(ROUTES_PATH.NewBill);
      document.body.innerHTML = NewBillUI();
      new NewBill({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });
      // document.location = "/#employee/bill/new";
      fireEvent.change(screen.getByTestId("file"), "file.pdf");
      expect(getByTestId(document.body, "errFile")).not.toHaveClass("hiden");
    });

    it(" Should display an error message when the file extension is not correct", () => {
      // Pretend that we're connected as an employee.
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@company.test",
        })
      );
      window.onNavigate(ROUTES_PATH.NewBill);
      document.body.innerHTML = NewBillUI();
      new NewBill({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });
      // fill up the form
      fireEvent.change(screen.getByTestId("expense-type"), "Hôtel et logement");
      fireEvent.change(screen.getByTestId("expense-name"), "Hotel");
      fireEvent.change(screen.getByTestId("datepicker"), "2022-04-05");
      fireEvent.change(screen.getByTestId("amount"), "400");
      fireEvent.change(screen.getByTestId("vat"), "20");
      fireEvent.change(screen.getByTestId("pct"), "20");
      // document.location = "/#employee/bill/new";
      fireEvent.change(screen.getByTestId("file"), "file.png");
      userEvent.click(screen.getByText("Envoyer"));
      expect(window.location.hash).toBe("#employee/bills");
    });
  });
});
