import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import { render, screen, cleanup, waitForElement } from "@testing-library/react";
import SliderComponent from "../../components/SliderComponent";

import * as nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/' }));

 
describe('SliderComponent Component', () => {  
    it("renders a SliderComponent", async () => {

        render(<SliderComponent />);
        expect(screen.getByText(/Encuentra tu curso/i)).toBeInTheDocument()
        
    })
})