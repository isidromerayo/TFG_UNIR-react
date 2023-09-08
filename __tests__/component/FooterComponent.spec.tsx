import { it } from "@jest/globals";
import FooterComponent from "../../components/FooterComponent";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe('Footer Component', () => {  
    xit("renders a footer", () => {
        render(<FooterComponent />);
    })
})