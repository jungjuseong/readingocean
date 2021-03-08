package com.clbee.readingocean.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class ChoiceVoteCount {
    private Long choiceId;
    private Long voteCount;
}

