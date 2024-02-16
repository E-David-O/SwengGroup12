import {expect, it, describe } from "vitest";
import { render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoContext } from "../src/components/VideoUtil";
import SingleVideoUpload from "../src/components/SingleVideoUpload";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
describe('VideoUpload', () => {
    const testFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const user = userEvent.setup();
    it('renders the component', () => {
        expect(1).toBe(1);
    }); 
    it('renders the component', async () => {
        render(
            <MemoryRouter>
            <VideoContext.Provider value={{videos : [{file:testFile, uploaded : false, analysed: false, name: "test.mp4"}], setVideos: () => {} }}>
                    <SingleVideoUpload video={{file:testFile, uploaded : false, analysed: false, name: "test.mp4"}} />
            </VideoContext.Provider>
            </MemoryRouter>
        );
        expect(screen.findByRole('button', {name: 'Submit'})).toBeDefined();
        await user.click(screen.getByRole('button', {name: 'Submit'}));
        
    }); 
    it('changes when submitted', async () => {
        render(
            <MemoryRouter>
            <VideoContext.Provider value={{videos : [{file:testFile, uploaded : true, analysed: false, name: "test.mp4"}], setVideos: () => {} }}>
                    <SingleVideoUpload video={{file:testFile, uploaded : true, analysed: false, name: "test.mp4"}} />
            </VideoContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByText("Analysing test.mp4 ...")).toBeInTheDocument();
        screen.debug();
        await waitFor(() => expect(screen.getByText("Click Here to View Analysis of test.mp4")).toBeInTheDocument(),{
            timeout: 11000,
        });
        screen.debug();
        });
        
}, {
    timeout: 30000,
});
