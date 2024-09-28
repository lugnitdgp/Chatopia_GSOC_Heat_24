import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import styles from "./styles.module.css"

import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
    conversationId: string;
};

const ConversationId = async ({ params }: { params: IParams }) => {

    const conversation = await getConversationById(params.conversationId);
    const messages = await getMessages(params.conversationId)
    if (!conversation) {
        return (
          <div className={styles.wrapper}>
            <div className={styles.container}>
              <EmptyState />
            </div>
          </div>
        );
      }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Header conversation={ {...conversation , messages} } />
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    );
}

export default ConversationId;
  