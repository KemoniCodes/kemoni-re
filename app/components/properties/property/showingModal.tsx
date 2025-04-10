"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  //   Button,
  useDisclosure,
} from "@heroui/react";
import SwipeButton from "@/app/components/animata/button/swipe-button";
// import { urlFor } from "@/app/utils/imageUrl";
import ShowingImg from "@/public/showingModalmg.png";

export default function ShowingModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("blur");

  const buttonHandleOpen = (backdrop: React.SetStateAction<string>) => {
    setBackdrop(backdrop);
    onOpen();
  };

  return (
    <div className='showingContainer sticky top-24 self-start'>
      <div className='showingBox bg-casperWhite h-auto rounded-lg py-8 px-10 text-center'>
        <h3 className='text-offBlack mb-2'>interested?</h3>
        <h2 className='text-offBlack leading-[32px] mb-5'>
          schedule a <br /> showing
        </h2>
        <SwipeButton
          className='second h3 !text-offBlack !border-b-offBlack'
          firstClass=''
          firstText='pick your date and time'
          secondClass='bg-offBlack text-casperWhite'
          secondText='pick your date and time'
          onClick={() => {
            console.log("Opening modal");
            buttonHandleOpen(backdrop);
          }}
        />
        <Modal
          backdrop={"blur"}
          isOpen={isOpen}
          onClose={onClose}
          scrollBehavior={"outside"}
          onOpenChange={onOpenChange}
          // motionProps={{
          //   variants: {
          //     enter: {
          //       y: 0,
          //       opacity: 1,
          //       transition: {
          //         duration: 0.3,
          //         ease: "easeOut",
          //       },
          //     },
          //     exit: {
          //       y: -20,
          //       opacity: 0,
          //       transition: {
          //         duration: 0.2,
          //         ease: "easeIn",
          //       },
          //     },
          //   },
          // }}
        >
          <ModalContent className='max-w-[90vw] min-h-[90vh]'>
            {() => (
              <>
                <ModalBody>
                  <div className='scheduleShowing'>
                    <div className='row flex'>
                      <div
                        className='img w-1/2 h-[90vh] bg-cover bg-center'
                        style={{
                          backgroundImage: ShowingImg
                            ? `url(${ShowingImg.src})`
                            : "none",
                        }}
                      />
                      <div className='showingSelector w-1/2 px-12 m-auto'>
                        <h2 className='text-center mb-6'>schedule a tour</h2>
                        <p className='text-center'>
                          I would love to give you a private tour of this
                          stunning property. Kindly select your preferred date
                          and time below, and I&apos;ll be in touch promptly to
                          confirm your appointment.
                        </p>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
