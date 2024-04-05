// @ts-nocheck
import {expect, it, describe} from "vitest";
import { render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoContext } from "../src/components/VideoUtil";
import SingleVideoUpload from "../src/components/SingleVideoUpload";
import VideoCard from "../src/components/VideoCard";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";

describe('VideoUpload', () => {
    const testFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const user = userEvent.setup();
    it('first test check', () => {
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

        const {rerender} = render(
            <MemoryRouter>
            <VideoContext.Provider value={{videos : [{file:testFile, uploaded : true, analysed: false, name: "test.mp4"}], setVideos: () => {} }}>
                    <SingleVideoUpload video={{file:testFile, uploaded : true, analysed: false, name: "test.mp4"}} />
            </VideoContext.Provider>
            </MemoryRouter>
        );
        
        await waitFor(() => expect(screen.getByText("Analysing test.mp4 ...")).toBeInTheDocument(),{
        });

        const dummyResult = {
            name: "test.mp4",
            results: [{
                selector: "test",
                run_time: 0.34,
                frames: [
                    {
                        frame_number: 1,
                        results: [{ class_id: "test", conf: 0.62 }],
                        image: "base64imageString"
                    },
                    {
                        frame_number: 1,
                        results: [{ class_id: "test", conf: 0.54 }],
                        image: "base64imageString"
                    }
                ]}
            ]
        };

        rerender(
            <MemoryRouter>
                <VideoContext.Provider value={{ 
                    videos: [{ file: testFile, uploaded: true, analysed: true, name: "test.mp4", duration: "2:34" }], 
                    setVideos: () => {}, 
                    resultList: [dummyResult], 
                    setResultList: () => {}
                }}>
                    <VideoCard result={dummyResult} video={{ name: "test.mp4", duration: "2:34" }} />
                </VideoContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('test.mp4')).toBeInTheDocument();
        });
    });
}, {
    timeout: 1500,
}
);
