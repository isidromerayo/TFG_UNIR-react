import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import SliderComponent from "../../components/SliderComponent";

import * as nextRouter from 'next/router';

const mockPush = jest.fn();
nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  route: '/',
  push: mockPush,
  query: {},
  pathname: '/',
  asPath: '/',
}));

 
describe('SliderComponent Component', () => {  
    it("renders a SliderComponent", async () => {

        render(<SliderComponent />);
        expect(screen.getByText(/Encuentra tu curso/i)).toBeInTheDocument()
        
    })
})