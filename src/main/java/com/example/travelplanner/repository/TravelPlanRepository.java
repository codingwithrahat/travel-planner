package com.example.travelplanner.repository;

import com.example.travelplanner.model.TravelPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TravelPlanRepository extends MongoRepository<TravelPlan, String> {

}

