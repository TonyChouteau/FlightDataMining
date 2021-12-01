#!/usr/bin/python
# -*- coding: utf-8 -*-
from flight import Flight
from vocabulary import *

import collections, functools, operator
from collections import OrderedDict

import functions as f


class RewriterFromCSV(object):
    def __init__(self, voc: Vocabulary, df: str, debug=False):
        """
        Translate a dataFile using a given vocabulary
        """
        self.__max = 0.999999

        self.__debug = debug

        self.vocabulary: Vocabulary = voc
        self.dataFile: str = df

        self.flights = []
        self.count = 0

        self.__average = None
        self.__old_flights = self.flights
        self.__filter = {}

    def set_debug(self, debug):
        self.__debug = debug

    def readAndRewrite(self):
        """
        """
        line: str
        f: Flight
        try:
            with open(self.dataFile, 'r') as source:
                next(source)
                for line in source:
                    line = line.strip()
                    if line != "" and line[0] != "#":
                        f = Flight(line, self.vocabulary)
                        formatted_flight = f.rewrite()
                        self.flights.append(formatted_flight)
                        ##Do what you need with the rewriting vector here ...
                        print("-----------------------------")
                        print(f)
                        print("Rewritten flight :", formatted_flight)
                        print("-----------------------------")

        except:
            raise Exception("Error while loading the dataFile %s" % (self.dataFile))

    def set_filter(self, user_filter={}):
        self.__filter = user_filter
        if self.__debug:
            print("\nFilter :", self.__filter)

    def __check_filter(self, flight):
        check = True
        for key in self.__filter.keys():
            if min(self.__filter[key], self.__max) >= flight[key]:
                check = False
        return check

    def reset_filter(self):
        self.flights = self.__old_flights

    def filter(self):
        self.__old_flights = self.flights
        self.flights = [flight for flight in self.flights if self.__check_filter(flight)]
        if self.__debug:
            print(len(self.__old_flights), len(self.flights))

    def average(self, normalized=True):
        size = len(self.flights)
        if size > 0:
            self.__average = OrderedDict(self.flights[0])
            self.count = len(self.flights)
            avg = dict(functools.reduce(operator.add, map(collections.Counter, self.flights)))
            for a in avg.keys():
                self.__average[a] = round(avg[a] / (size if normalized else 1), 3)

            if self.__debug:
                print("\nAverage :", self.__average)

            return self.__average

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python rewriterFromCSV.py <vocfile> <dataFile>")
    else:
        if os.path.isfile(sys.argv[1]):
            voc: Vocabulary = Vocabulary(sys.argv[1])
            if os.path.isfile(sys.argv[2]):
                rw: RewriterFromCSV = RewriterFromCSV(voc, sys.argv[2], debug=True)
                rw.readAndRewrite()

                # q1(rw)
                # q2(rw)
                # q3_assoc(rw)
                f.q3_atypical(rw)
            else:
                print(f"Data file {sys.argv[1]} not found")
        else:
            print("Voc file {sys.argv[2]} not found")
