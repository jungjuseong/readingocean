package com.clbee.readingocean.util;

import com.clbee.readingocean.model.Book;
import com.clbee.readingocean.model.Poll;
import com.clbee.readingocean.model.User;
import com.clbee.readingocean.payload.BookResponse;
import com.clbee.readingocean.payload.ChoiceResponse;
import com.clbee.readingocean.payload.PollResponse;
import com.clbee.readingocean.payload.UserSummary;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ModelMapper {

    public static BookResponse mapBookToBookResponse(Book book, User creator) {

        BookResponse response = new BookResponse();

        response.setIsbn(book.getIsbn());
        response.setTitle(book.getTitle());
        response.setAuthors(book.getAuthors());
        if (creator != null) {
            response.setPublisher (creator.getUsername());
        }
        else {
            response.setPublisher("clbee---");
        }
        response.setCreatedAt(book.getCreatedAt());

        return response;
    }

    public static PollResponse mapPollToPollResponse(Poll poll, Map<Long, Long> choiceVotesMap, User creator, Long userVote) {

        PollResponse pollResponse = new PollResponse();
        pollResponse.setId(poll.getId());
        pollResponse.setQuestion(poll.getQuestion());
        pollResponse.setCreationDateTime(poll.getCreatedAt());
        pollResponse.setExpirationDateTime(poll.getExpirationDateTime());
        Instant now = Instant.now();
        pollResponse.setIsExpired(poll.getExpirationDateTime().isBefore(now));

        List<ChoiceResponse> choiceResponses = poll.getChoices().stream().map(choice -> {
            ChoiceResponse choiceResponse = new ChoiceResponse();
            choiceResponse.setId(choice.getId());
            choiceResponse.setText(choice.getText());

            if(choiceVotesMap.containsKey(choice.getId())) {
                choiceResponse.setVoteCount(choiceVotesMap.get(choice.getId()));
            } else {
                choiceResponse.setVoteCount(0);
            }
            return choiceResponse;
        }).collect(Collectors.toList());

        pollResponse.setChoices(choiceResponses);
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        pollResponse.setCreatedBy(creatorSummary);

        if(userVote != null) {
            pollResponse.setSelectedChoice(userVote);
        }

        long totalVotes = pollResponse.getChoices().stream().mapToLong(ChoiceResponse::getVoteCount).sum();
        pollResponse.setTotalVotes(totalVotes);

        return pollResponse;
    }

}
