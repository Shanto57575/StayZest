import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme();

const BookingModal = ({
	isOpen,
	onClose,
	reason,
	setReason,
	handleCancellation,
}) => (
	<ThemeProvider theme={theme}>
		<Modal open={isOpen} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 400,
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 4,
					borderRadius: 2,
				}}
			>
				<h2 className="text-lg font-semibold mb-4">Cancellation Reason</h2>
				<TextField
					label="Reason"
					variant="outlined"
					fullWidth
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					className="mb-4"
				/>
				<div className="flex justify-end space-x-2 mt-4">
					<Button onClick={onClose} variant="outlined">
						Cancel
					</Button>
					<Button
						onClick={handleCancellation}
						variant="contained"
						disabled={!reason}
					>
						Submit
					</Button>
				</div>
			</Box>
		</Modal>
	</ThemeProvider>
);

export default BookingModal;
