import Firebase from "../../firebase/Firebase";
import { ChatTypes } from "../constants/Constants";

export default function sendMessage(
	sender,
	msg,
	groupId,
	type = ChatTypes.CHAT,
	time
) {
	const at = time ? time : new Date().getTime();
	Firebase.database().ref("Messages").child(groupId).child(at).set({
		msg,
		sender,
		at,
		type,
	});
}
